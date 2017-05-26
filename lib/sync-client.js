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

  static createMessagePageNotFound (page) {
    console.log('Page not found')
    console.log(`Pages retrieves: ${page - 1}`)
  }

  static createMessageRetryRequest () {
    console.log('Too may request')
    console.log('Waiting...')
  }

  static createErrorMessage () {
    console.log('==============================================')
    console.log('An error has occurred')
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
      console.log('next interval page ', page)
    }
    let timer = setInterval(executor, secondsInterval)
  }

  getPage (page, timer) {
    this.tvmazeClient.getPage(page).then(({ body }) => {
      if (this.exceedsNumberOfPages()) {
        clearInterval(timer)
        SyncClient.createMessageExcessPages(page)
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
      SyncClient.createMessagePageNotFound(page)
    } else if (SyncClient.isTooManyRequest(err) && this.canRetry()) {
      SyncClient.createMessageRetryRequest()
      this.asyncRetry(page)
    } else {
      console.log('Maximum number of retries reached')
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
      console.log(`Show with id ${response.insertedIds[0]} inserted`)
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
}
