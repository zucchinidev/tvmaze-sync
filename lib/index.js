import { SyncClient } from './SyncClient'
import { tvmaze } from 'tvmaze-zucchinidev'
const client = tvmaze.createClient()

const createClient = (configuration) => new SyncClient({configuration, client})
export const sync = {
  createClient
}
