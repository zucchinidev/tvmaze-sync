import { test } from 'babel-tap'
import { Configuration } from '../lib/configuration'
import { Constants } from '../lib/constants'
const configuration = new Configuration(Constants.getConstants())

test('should create a configuration instance', (t) => {
  t.ok(configuration, 'should exist')
  t.equals(typeof configuration, 'object', 'should be an object')
  t.end()
})

test('should create a configuration instance with db data', (t) => {
  let config = configuration.getConfig()
  t.ok(config, 'should exist')
  t.equals(typeof config, 'object', 'should exist')
  t.ok(config.dbConnection, 'should exist')
  t.ok(config.dbName, 'should exist')
  t.ok(config.collectionName, 'should exist')
  t.end()
})
