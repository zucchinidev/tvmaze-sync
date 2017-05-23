export class Configuration {
  constructor (constants) {
    this.constanst = constants
  }

  getConfig () {
    return {
      dbConnection: this.constanst.DB_CONNECTION_STRING,
      dbName: this.constanst.DB_NAME,
      collectionName: this.constanst.COLLECTION_NAME
    }
  }
}
