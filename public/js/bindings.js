const $ = require('jquery')
const handlers = require('./handlers')

const setupBindings = () => {
  $('#submit').on('click', handlers.processTracks)
  $('#tracklist').on('input propertychange', handlers.inputChanged)
  $('#btn-grab-tracks').on('click', handlers.grabYouTubeTracks)
}

module.exports = {
  setupBindings: setupBindings
}