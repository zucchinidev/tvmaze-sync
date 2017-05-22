const mongoConnection = require('../mongo-connection')
const collectionName = 'items'


const items = (app, itemsRoute) => {
  const getItems = (req, res) => {
    mongoConnection
      .find(collectionName, {})
      .then(result => result.length > 0 ? res.json(result) : res.status(204).send())
      .catch(err => resError(err, res))
  }

  const createItems = (req, res) => {
    mongoConnection
      .inserting(collectionName, req.body)
      .then(result => res.status(201).json(result.ops[0]))
      .catch(err => resError(err, res))
  }

  const resError = (err, res) => {
    res.status(500).send(err)
  }

  app.route(itemsRoute)
    .get(getItems)
    .post(createItems)
}

module.exports = items