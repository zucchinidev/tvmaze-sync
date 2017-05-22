import { test } from 'babel-tap'
import { syncClient } from '../lib'
import { SyncClient } from '../lib/SyncClient'

test('should create a sync client', (t) => {
  t.ok(syncClient, 'should exist')
  t.equals(typeof syncClient, 'object', 'should be an object')
  t.ok(syncClient instanceof SyncClient, 'should be instance of SyncClient')
  t.end()
})
