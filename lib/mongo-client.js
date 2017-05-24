const mongo = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

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
    this.ObjectID = ObjectID
    this.subscribeEventProcessSigint()
  }

  connecting () {
    const executor = (resolve, reject) => {
      if (typeof this.db === 'undefined') {
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
    this.db.close(() => {
      console.log('Force to close the MongoDB conection')
      if (process.env.NODE_ENV !== 'test') {
        process.exit(0)
      }
    })
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
    return this.connecting()
      .then(col => col.insert(document))
  }

  insertMany (document) {
    return this.connecting()
      .then(col => col.insert(document))
  }

  update (query, document) {
    query = MongoClient.getObjectId(query)
    return this.connecting()
      .then(col => col.update(query, document))
  }

  deleteOne (query) {
    return this.connecting()
      .then(col => col.deleteOne(query))
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

  deleteMany (query) {
    return this.connecting()
      .then(col => col.deleteMany(query))
  }

  subscribeEventProcessSigint () {
    process.on('SIGINT', () => {
      this.close()
    })
  }
}
