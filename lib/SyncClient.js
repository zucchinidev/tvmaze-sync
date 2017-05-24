import { MongoClient } from './mongo-client'

export class SyncClient {
  static get constants () {
    // 20 calls every 10 seconds per IP address.
    return {
      limitRequest: 20,
      timeInterval: 10000,
      tooManyRequest: 429,
      notFound: 404,
      maxNumberOfRetries: 3,
      waitTime: 10000,
      maximunNumberOfPage: 100
    }
  }

  constructor ({configuration, client}) {
    this.configuration = configuration
    this.client = client
    this.mongoClient = new MongoClient(configuration.getConfig())
    this.retries = 0
    this.recoveredPages = 0
  }

  sync (page = 0) {
    const increment = this.getIncremental(page)
    let timer = setInterval(() => {
      this.getPage(page, timer)
      page = increment()
      console.log('next interval page ', page)
    }, this.getSecondsInterval())
  }

  getPage (page, timer) {
    this.client.getPage(page).then(({body}) => {
      if (this.recoveredPages > SyncClient.constants.maximunNumberOfPage) {
        console.log(`Pages retrieves: ${page - 1}`)
        console.log('Maximum number of pages reached')
        clearInterval(timer)
      } else {
        this.mongoClient.insertMany(body).then((r) => {
          console.log('Show with id ${}inserted')
        })
        this.recoveredPages += 1
      }
    }).catch((err) => {
      console.log('==============================================')
      console.log('An error has occurred')
      const pageNotFound = err.message === 'Status code 404'
      const tooManyRequest = err.message === 'Status code 429'
      const canRetry = this.retries < SyncClient.constants.maxNumberOfRetries
      clearInterval(timer)
      if (pageNotFound) {
        console.log('Page not found')
        console.log(`Pages retrieves: ${page - 1}`)
      } else if (tooManyRequest && canRetry) {
        console.log('Too may request')
        console.log('Waiting...')
        setTimeout(() => {
          console.log('Retry...')
          this.retries += 1
          this.sync(page)
        }, SyncClient.constants.waitTime)
      } else {
        console.log('Maximum number of retries reached')
        process.exit(0)
      }
    })
  }

  getIncremental (page) {
    return () => {
      page += 1
      return page
    }
  }

  getSecondsInterval () {
    return (SyncClient.constants.timeInterval / SyncClient.constants.limitRequest) * 2
  }
}
