import { test, beforeEach } from 'babel-tap'
import { Configuration } from '../lib/configuration'
import { MongoClient } from '../lib/mongo-client'

let mongo
let configuration
let constants = {
  DB_CONNECTION_STRING: 'mongodb://localhost:27017',
  DB_NAME: 'tvmaze_sync_test',
  COLLECTION_NAME: 'test'
}

beforeEach((done) => {
  configuration = new Configuration(constants)
  mongo = new MongoClient(configuration.getConfig())
  done()
})

test('should create a mongo client', (t) => {
  t.ok(MongoClient, 'should exist')
  t.equals(typeof mongo, 'object', 'should be an object')
  t.ok(mongo instanceof MongoClient, 'should be instance of SyncClient')
  t.end()
})

test('should connect with mongodb server', (t) => {
  const config = configuration.getConfig()
  const today = new Date()
  const timestamp = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`
  const url = `${config.dbConnection}/${config.dbName}_${timestamp}`
  t.equals(mongo.url, url, 'should be a same url')
  t.equals(mongo.collectionName, config.collectionName, 'should be a same collection name')
  mongo.connecting().then((col) => {
    t.ok(col, 'should exist')
    t.equals(typeof col, 'object', 'should retrieve a collection object')
    mongo.close()
    t.end()
  })
})

test('should throw error in mongo connection', (t) => {
  const configuration = new Configuration({
    dbConnection: 'fake',
    dbName: 'fake',
    collectionName: 'fake'
  })
  const config = configuration.getConfig()
  const mongo = new MongoClient(config)
  mongo.connecting()
    .then(Function.prototype)
    .catch((err) => {
      t.ok(err, 'should exist')
      t.end()
    })
})

test('should inserting one document', (t) => {
  const document = {
    text: 'fake',
    value: 'fake'
  }
  mongo.insert(document).then((col) => {
    t.ok(col, 'should exist')
    t.equals(typeof col, 'object', 'should retrieve a response object')
    t.equals(col.insertedCount, 1, 'should create one document')
    t.ok(Array.isArray(col.insertedIds), 'should retrieve an array of insertedIds')
    t.equals(typeof col.insertedIds[0], 'object', 'should retrieve insertedIds')
    t.ok(col.insertedIds[0] instanceof mongo.ObjectID, 'should retrieve insertedIds')
    t.equals(col.insertedIds.length, 1, 'should retrieve one id')
    mongo.close()
    t.end()
  })
})
