export class Constants {
  static DB_CONNECTION_STRING = 'mongodb://localhost:27017'
  static DB_NAME = 'movuex_aggregates'
  static COLLECTION_NAME = 'shows'

  static getConstants () {
    const constants = {}
    for (const c in Constants) {
      if (Constants.hasOwnProperty(c)) {
        constants[c] = Constants[c]
      }
    }
    return constants
  }
}
Object.seal(Constants)
