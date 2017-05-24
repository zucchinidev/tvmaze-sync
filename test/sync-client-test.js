import { test, beforeEach } from 'babel-tap'
import { sync } from '../lib'
import { SyncClient } from '../lib/SyncClient'
import { Configuration } from '../lib/configuration'

const constants = {
  DB_CONNECTION_STRING: 'mongodb://localhost:27017',
  DB_NAME: 'tvmaze_sync_test',
  COLLECTION_NAME: 'sync'
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
  t.ok(syncClient.configuration instanceof Configuration, 'should be instance of SyncClient')
  t.equals(typeof syncClient.client, 'object', 'should be an object')
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
  t.equals(syncClient.getSecondsInterval(), 1000, 'should be one second')
  t.end()
})

test('should perform the synchronization', (t) => {
  t.ok(syncClient.sync, 'should exist')
  t.equals(typeof syncClient.sync, 'function', 'should be a function')
  syncClient.sync(0)
  t.end()
})
