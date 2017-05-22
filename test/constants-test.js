import { test } from 'babel-tap'
import { Constants } from '../lib/constants'

test('should exists constants', (t) => {
  t.ok(Constants, 'should exist')
  t.equals(typeof Constants, 'function', 'should be a constructor function')
  t.end()
})

test('should retrieve the constants', (t) => {
  const constants = Constants.getConstants()
  t.equals(typeof constants, 'object', 'should be an object')
  t.ok(Object.keys(constants).length > 0, 'has properties')
  t.ok('DB_CONNECTION_STRING' in constants, 'Represents the url of the database')
  t.ok('DB_NAME' in constants, 'Represents the name of the database')
  t.ok('COLLECTION_NAME' in constants, 'Represents the collection name')
  t.end()
})
