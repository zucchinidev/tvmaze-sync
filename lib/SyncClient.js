import { MongoClient } from './mongo-client'
export class SyncClient {
  constructor ({configuration, client}) {
    this.configuration = configuration
    this.client = client
    this.mongoClient = new MongoClient(configuration.getConfig())
  }
}
