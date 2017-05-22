import { test, threw } from 'babel-tap'
import configuration from '../lib/configuration'
import { MongoClient } from '../lib/mongo-client'

test('should create a mongo client', (t) => {
  const mongo = new MongoClient(configuration.getConfig())
  t.ok(MongoClient, 'should exist')
  t.equals(typeof mongo, 'object', 'should be an object')
  t.ok(mongo instanceof MongoClient, 'should be instance of SyncClient')
  t.end()
})

test('should connect with mongodb server', (t) => {
  const config = configuration.getConfig()
  const mongo = new MongoClient(config)
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
}).catch(threw)
