import { test } from 'babel-tap'
import { Configuration } from '../lib/configuration'

const constants = {
  mongo: {
    dbConnection: 'mongodb://localhost:27017',
    dbName: 'tvmaze_sync_test',
    collectionName: 'sync'
  },
  request: {
    maxNumberOfPages: 100,
    initialPage: 0
  }
}

const configuration = new Configuration(constants)

test('should create a configuration instance', (t) => {
  t.ok(configuration, 'should exist')
  t.equals(typeof configuration, 'object', 'should be an object')
  t.end()
})

test('should create a configuration instance with db data', (t) => {
  const config = configuration.getConfig()
  t.ok(config, 'should exist')
  t.equals(typeof config, 'object', 'config should exist')
  t.ok(config.mongo.dbConnection, 'dbConnection should exist')
  t.ok(config.mongo.dbName, 'dbName should exist')
  t.ok(config.mongo.collectionName, 'collectionName should exist')
  t.end()
})

test('should create a configuration instance with request data', (t) => {
  const config = configuration.getConfig()
  t.ok(config, 'should exist')
  t.equals(typeof config, 'object', 'config should exist')
  t.ok(config.request.maxNumberOfPages, 'maxNumberOfPages should exist in request')
  t.equals(typeof config.request.initialPage, 'number', 'initialPage should exist in request')
  t.equals(config.request.maxNumberOfPages, 100, 'max number of pages should be 100')
  t.equals(config.request.initialPage, 0, 'initial page should be 0')
  t.end()
})

test('should throw error for invalid configuration instance', (t) => {
  try {
    new Configuration({
      request: {
        maxNumberOfPages: 100,
        initialPage: 0
      }
    })
  } catch (err) {
    const msg = 'Configuration not valid, mongo must be defined'
    t.ok(err, 'There must be an error')
    t.equals(err.message, msg, 'mongo is mandatory')
  }
  t.end()
})

test('should throw error for invalid configuration instance', (t) => {
  const configuration = new Configuration({
    mongo: {
      dbConnection: 'mongodb://localhost:27017',
      dbName: 'tvmaze_sync_test',
      collectionName: 'sync'
    }
  })
  t.ok(configuration, 'should exists')
  t.equals(configuration.getConfig().request.initialPage, 0, '0 is the default page')
  t.equals(configuration.getConfig().request.maxNumberOfPages, 100, '100 is the default maximum number of pages')
  t.end()
})

test('should throw error for invalid configuration instance', (t) => {
  t.doesNotThrow(function () {
    const configuration = new Configuration({
      mongo: {
        dbConnection: 'mongodb://localhost:27017',
        dbName: 'tvmaze_sync_test',
        collectionName: 'sync'
      }
    })
    t.ok(configuration, 'should exists')
    t.equals(configuration.getConfig().request.initialPage, 0, '0 is the default page')
    t.equals(configuration.getConfig().request.maxNumberOfPages, 100, '100 is the default maximum number of pages')
  });
  t.end()
})
