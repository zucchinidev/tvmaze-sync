export class SyncClient {
  static get constants () {
    // 20 calls every 10 seconds per IP address.
    return {
      limitRequest: 20,
      timeInterval: 10000,
      tooManyRequest: 429,
      notFound: 404,
      maxNumberOfRetries: 3,
      waitTime: 10000
    }
  }

  static getSecondsInterval () {
    return (SyncClient.constants.timeInterval / SyncClient.constants.limitRequest) * 2
  }

  static createMessageExcessPages (page) {
    console.log(`Pages retrieves: ${page - 1}`)
    console.log('Maximum number of pages reached')
  }

  static createMessageRetryRequest () {
    console.log('Too may request')
    console.log('Waiting...')
  }

  static createErrorMessage () {
    console.log('==============================================')
    console.log('Ended process')
  }

  static isTooManyRequest (err) {
    return err.message === 'Status code 429'
  }

  static isPageNotFound (err) {
    return err.message === 'Status code 404'
  }

  constructor ({ tvmazeClient, mongoClient, requestConfiguration }) {
    this.tvmazeClient = tvmazeClient
    this.mongoClient = mongoClient
    this.requestConfiguration = requestConfiguration
    this.retries = 0
    this.recoveredPages = 0
  }

  sync () {
    let { initialPage: page } = this.requestConfiguration
    const increment = this.getIncremental(page)
    const secondsInterval = SyncClient.getSecondsInterval()
    const executor = () => {
      this.getPage(page, timer)
      page = increment()
      console.log('Next interval page ', page)
    }
    let timer = setInterval(executor, secondsInterval)
  }

  getPage (page, timer) {
    this.tvmazeClient.getPage(page).then(({ body }) => {
      if (this.exceedsNumberOfPages()) {
        clearInterval(timer)
        SyncClient.createMessageExcessPages(page)
        this.exit()
      } else {
        this.insertPage(body, page)
      }
    }).catch((err) => {
      SyncClient.createErrorMessage()
      clearInterval(timer)
      this.catchError(err, page)
    })
  }

  catchError (err, page) {
    if (SyncClient.isPageNotFound(err)) {
      this.createMessagePageNotFound(page)
      this.mongoClient.count({}).then((docs) => {
        console.log(`Documents inserted: ${docs}`)
        this.exit()
      }).catch(() => {
        this.exit()
      })
    } else if (SyncClient.isTooManyRequest(err) && this.canRetry()) {
      SyncClient.createMessageRetryRequest()
      this.asyncRetry(page)
    } else {
      console.log('Maximum number of retries reached')
      this.exit()
    }
  }

  exceedsNumberOfPages () {
    const { maxNumberOfPages } = this.requestConfiguration
    return this.recoveredPages >= maxNumberOfPages
  }

  asyncRetry (page) {
    setTimeout(() => {
      console.log('Retry...')
      this.retries += 1
      this.sync(page)
    }, SyncClient.constants.waitTime)
  }

  canRetry () {
    return this.retries < SyncClient.constants.maxNumberOfRetries
  }

  insertPage (body, page) {
    this.mongoClient.insertMany(body).then((response) => {
      console.log(`Inserted page ${page} with ${response.insertedCount} documents`)
      this.recoveredPages += 1
    }).catch(() => {
      console.log(`Page ${page} not inserted`)
    })
  }

  getIncremental (page) {
    return () => {
      page += 1
      return page
    }
  }

  exit () {
    if (process.env.NODE_ENV !== 'test') {
      process.exit(0)
    }
  }

  createMessagePageNotFound (page) {
    console.log(`Page ${page} not found`)
    console.log(`Recovered pages: ${this.recoveredPages}`)
  }
}
