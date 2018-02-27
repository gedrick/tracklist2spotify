'use strict'
const $ = require('jquery')
const handlers = require('./handlers')

const setupBindings = () => {
  $('#submit').on('click', handlers.processTracks)
  $('#tracklist').on('input propertychange', handlers.inputChanged)
  $('#btn-grab-tracks').on('click', handlers.grabYouTubeTracks)
  $('#submit-tracks').on('click', handlers.processTracks)
  $('#btn-save-tracks').on('click', handlers.saveTracks)
  // Work in progress
  // $('#alertModal').on('show.bs.modal', event => {
  //   const fields = event.relatedTarget
  //   let modal = $(this)
  //   modal.find('#alert-message').text(fields.message)
  //   modal.find('#show-spinner').show(fields.spinner || true)
  // })
}

const showAlertModal = event => {
  
}

module.exports = {
  setupBindings: setupBindings
}