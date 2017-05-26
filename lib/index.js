import { SyncClient } from './sync-client'
import { tvmaze } from 'tvmaze-zucchinidev'
import { Configuration } from './configuration'
import { MongoClient } from './mongo-client'

const tvmazeClient = tvmaze.createClient()

const createClient = (configuration) => {
  const config = new Configuration(configuration)
  const {mongo: mongoConfiguration, request: requestConfiguration} = config.getConfig()
  const mongoClient = new MongoClient(mongoConfiguration)
  return new SyncClient({
    tvmazeClient,
    mongoClient,
    requestConfiguration
  })
}
export const sync = {
  createClient
}
