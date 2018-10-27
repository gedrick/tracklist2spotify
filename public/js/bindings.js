'use strict'
const $ = require('jquery')
const handlers = require('./handlers')

const setupBindings = () => {
  // Trigger the regex processing.
  $('#tracklist').on('input propertychange', handlers.inputChanged)
  $('#regex-select').on('change', handlers.inputChanged)
  $('#btn-preview').on('click', handlers.inputChanged)

  // Start querying Spotify API.
  $('#submit-tracks').on('click', handlers.processTracks)

  // Fetch hit Youtube API.
  $('#btn-grab-tracks').on('click', handlers.grabYouTubeTracks)

  // Start saving track data to playlist.
  $('#btn-save-tracks').on('click', handlers.saveTracks)
}

module.exports = {
  setupBindings: setupBindings
}