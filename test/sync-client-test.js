import { test, beforeEach } from 'babel-tap'
import { sync } from '../lib'
import { SyncClient } from '../lib/sync-client'
import { Configuration } from '../lib/configuration'
const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)

const constants = {
  mongo: {
    dbConnection: 'mongodb://localhost:27017',
    dbName: 'tvmaze_sync_test',
    collectionName: 'sync'
  }
}
const configuration = new Configuration(constants)
let syncClient
beforeEach((done) => {
  syncClient = sync.createClient(configuration)
  done()
})

test('should create a sync client', (t) => {
  t.ok(sync, 'should exist')
  t.equals(typeof sync, 'object', 'should be an object')
  t.ok(syncClient instanceof SyncClient, 'should be instance of SyncClient')
  t.ok(syncClient.tvmazeClient instanceof Object, 'should be instance of SyncClient')
  t.ok(syncClient.mongoClient instanceof Object, 'should be instance of SyncClient')
  t.ok(syncClient.requestConfiguration instanceof Object, 'should be instance of SyncClient')
  t.end()
})

test('should create retrieve constants', (t) => {
  t.ok(SyncClient.constants, 'should exist')
  t.equals(typeof SyncClient.constants, 'object', 'should be an object')
  t.equals(SyncClient.constants.limitRequest, 20, 'should be 20 request')
  t.equals(SyncClient.constants.timeInterval, 10000, 'should be 10 seconds')
  t.equals(SyncClient.constants.tooManyRequest, 429, 'should be too may request http code')
  t.end()
})

test('should get successive number pages', (t) => {
  const increment = syncClient.getIncremental(0)
  let page = increment()
  t.equals(page, 1, 'should be equal to one')
  t.equals(increment(), 2, 'should be equal to two')
  t.equals(increment(), 3, 'should be equal to three')
  t.end()
})

test('should get second interval', (t) => {
  t.equals(SyncClient.getSecondsInterval(), 1000, 'should be one second')
  t.end()
})

test('should perform the synchronization', (t) => {
  sinon.stub(syncClient, 'getPage')
  let clock = sinon.useFakeTimers()
  t.ok(syncClient.sync, 'should exist')
  t.equals(typeof syncClient.sync, 'function', 'should be a function')
  syncClient.sync()
  t.equals(syncClient.getPage.callCount, 0, 'should be equal 0')
  clock.tick(SyncClient.getSecondsInterval())
  t.equals(syncClient.getPage.callCount, 1, 'should be equal 1')
  clock.restore()
  syncClient.getPage.restore()
  t.end()
})

test('should insert one page in mongodb', (t) => {
  const getPage = sinon.stub(syncClient.tvmazeClient, 'getPage').returns(Promise.resolve({
    body: { id: 'fake' }
  }))
  const insertPageStub = sinon.stub(syncClient, 'insertPage')
  syncClient.getPage(0)
  getPage().then(() => {
    t.equals(insertPageStub.callCount, 1, 'should insert a page')
    syncClient.tvmazeClient.getPage.restore()
    syncClient.insertPage.restore()
    t.end()
  })
})

test('maximum number of pages reached', (t) => {
  sinon.stub(syncClient.tvmazeClient, 'getPage').returnsPromise().resolves({})
  syncClient.recoveredPages = 100
  const timer = 2822
  syncClient.getPage(101, timer)
  syncClient.tvmazeClient.getPage.restore()
  syncClient.recoveredPages = 0
  t.end()
})

test('page not found', (t) => {
  const consoleStub = sinon.stub(console, 'log')
  sinon.stub(syncClient.tvmazeClient, 'getPage').returnsPromise().rejects({message: 'Status code 404'})
  const timer = 2822
  syncClient.getPage(180, timer)
  t.equals(consoleStub.callCount, 4, 'should show log message')
  syncClient.tvmazeClient.getPage.restore()
  console.log.restore()
  t.end()
})

test('too many request, Three attempts made', (t) => {
  const consoleStub = sinon.stub(console, 'log')
  syncClient.retries = 3
  sinon.stub(syncClient.tvmazeClient, 'getPage').returnsPromise().rejects({message: 'Status code 429'})
  const timer = 2822
  syncClient.getPage(20, timer)
  t.equals(consoleStub.callCount, 3, 'should show log message')
  syncClient.tvmazeClient.getPage.restore()
  console.log.restore()
  t.end()
})
