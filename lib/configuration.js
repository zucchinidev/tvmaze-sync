import { Constants } from './constants'

class Configuration {
  constructor (constants) {
    this.constanst = constants
  }

  getConfig () {
    return {
      db: this.constanst.DB_CONNECTION_STRING,
      dbName: this.constanst.DB_NAME,
      collectionName: this.constanst.COLLECTION_NAME
    }
  }
}

export default new Configuration(Constants.getConstants())
