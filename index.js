import { sync } from './lib'

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

const syncClient = sync.createClient(constants)
syncClient.sync()
