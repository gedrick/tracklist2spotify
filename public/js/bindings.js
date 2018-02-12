const $ = require('jquery')
const handlers = require('./handlers')

const setupBindings = () => {
  $('#submit').on('click', handlers.processTracks)
  $('.track-list').on('input propertychange', handlers.testRegex)
}

module.exports = {
  setupBindings: setupBindings
}