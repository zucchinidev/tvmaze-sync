const mongo = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
let cachedConnection = null
export class MongoClient {
  static getObjectId (query) {
    if (query._id) {
      query._id = new ObjectID(query._id)
    }
    return query
  }

  static transformCallback (resolve, reject) {
    return (err, result) => {
      return err ? reject(err) : resolve(result)
    }
  }

  constructor ({dbConnection, dbName, collectionName}) {
    const today = new Date()
    dbName += `_${today.getFullYear()}${today.getMonth()}${today.getDate()}`
    this.url = `${dbConnection}/${dbName}`
    this.collectionName = collectionName
  }

  connecting () {
    const executor = (resolve, reject) => {
      if (cachedConnection !== null) {
        mongo.connect(this.url, (err, db) => {
          if (err) {
            reject(err)
          } else {
            this.db = db
            resolve(this.db.collection(this.collectionName))
          }
        })
      } else {
        resolve(this.db.collection(this.collectionName))
      }
    }
    return new Promise(executor)
  }

  close () {
    this.db.close()
  }

  find (query) {
    return new Promise((resolve, reject) => {
      query = MongoClient.getObjectId(query)
      this.connecting()
        .then(col => {
          col
            .find(query)
            .toArray(MongoClient.transformCallback(resolve, reject))
        })
        .catch(err => reject(err))
    })
  }

  insert (document) {
    return new Promise((resolve, reject) => {
      this.connecting()
        .then(col => {
          col.insert(document, MongoClient.transformCallback(resolve, reject))
        })
        .catch(err => reject(err))
    })
  }

  update (query, document) {
    return new Promise((resolve, reject) => {
      query = MongoClient.getObjectId(query)
      this.connecting()
        .then(col => {
          col.update(query, document, MongoClient.transformCallback(resolve, reject))
        })
        .catch(err => reject(err))
    })
  }

  delete (query) {
    const executor = (resolve, reject) => {
      query = MongoClient.getObjectId(query)
      this.connecting()
        .then(col => {
          col.deleteOne(query, MongoClient.transformCallback(resolve, reject))
        })
        .catch(err => reject(err))
    }
    return new Promise(executor)
  }

  aggregate (query) {
    return new Promise((resolve, reject) => {
      this.connecting()
        .then(col => {
          col
            .aggregate(query)
            .toArray(MongoClient.transformCallback(resolve, reject))
        })
        .catch(err => reject(err))
    })
  }
}
