const _ = require('lodash')
const $ = require('jquery')
const handlers = require('./handlers')

const setupBindings = () => {
  $('#submit').on('click', handlers.processTracks)
}

module.exports = {
  setupBindings: setupBindings
}