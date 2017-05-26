const MAX_NUMBER_OF_PAGES = 100
const INITIAL_PAGE = 0

export class Configuration {
  static isDefined (value) {
    return typeof value !== 'undefined' && value !== null
  }

  constructor ({mongo, request = {} }) {
    Configuration.checkValidations(mongo, request)
    this.mongo = mongo
    this.request = request
  }

  getConfig () {
    const {mongo, request} = this
    return {
      mongo,
      request
    }
  }

  static checkValidations (mongo, request) {
    if (!Configuration.isDefined(mongo)) {
      throw new Error('Configuration not valid, mongo must be defined')
    }
    Configuration.checkMongoConfiguration(mongo)
    Configuration.checkRequestConfiguration(request)
  }

  static checkRequestConfiguration (request) {
    const hasMaxNumberOfPages = Configuration.isDefined(request.maxNumberOfPages)
    const hasInitialPage = Configuration.isDefined(request.initialPage)
    if (!hasMaxNumberOfPages) {
      request.maxNumberOfPages = MAX_NUMBER_OF_PAGES
    }
    if (!hasInitialPage) {
      request.initialPage = INITIAL_PAGE
    }
  }

  static checkMongoConfiguration (mongo) {
    const hasDBConnection = Configuration.isDefined(mongo.dbConnection)
    const hasDBName = Configuration.isDefined(mongo.dbName)
    const hasCollectionName = Configuration.isDefined(mongo.collectionName)
    if (!hasDBConnection || !hasDBName || !hasCollectionName) {
      const msg = `Configuration not valid, dbConnection, dbName and collectionName must be defined`
      throw new Error(msg)
    }
  }
}
