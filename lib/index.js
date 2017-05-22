import { SyncClient } from './SyncClient'
import { tvmaze } from 'tvmaze-zucchinidev'
import configuration from './configuration'
const client = tvmaze.createClient()
export const syncClient = new SyncClient({configuration, client})
