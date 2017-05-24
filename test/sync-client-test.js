import { test } from 'babel-tap'
import { sync } from '../lib'
import { SyncClient } from '../lib/SyncClient'
import { Configuration } from '../lib/configuration'

const constants = {
  DB_CONNECTION_STRING: 'mongodb://localhost:27017',
  DB_NAME: 'tvmaze_sync_test',
  COLLECTION_NAME: 'sync'
}

const configuration = new Configuration(constants)

test('should create a sync client', (t) => {
  const client = sync.createClient(configuration)
  t.ok(sync, 'should exist')
  t.equals(typeof sync, 'object', 'should be an object')
  t.ok(client instanceof SyncClient, 'should be instance of SyncClient')
  t.ok(client.configuration instanceof Configuration, 'should be instance of SyncClient')
  t.equals(typeof client.client, 'object', 'should be an object')
  t.end()
})
