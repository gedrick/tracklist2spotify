'use strict'
const $ = require('jquery')
const _ = require('lodash')

const ui = {
  step1: $('.step1'),
  step2: $('.step2'),
  youtubeUrl: $('#youtube-url'),
  btnGrabTracks: $('#btn-grab-tracks'),
  
  // Data entry and parsing.
  trackList: $('#tracklist'),
  selector: $('#regex-select'),
  preview: $('#tracklist-preview'),

  // User playlist list and options
  // Not used as they must not be cached.
  // playlistSelector: $('#playlistSelector'),
  // selectedTracks: $('.found-track-selection'),
  // playlistMethod: $('input[name=playlistMethod]:checked').val(),

  // Modals.
  errorModal: $('#errorModal'),
  searchingModal: $('#searchingModal'),
  spotifyErrorModal: $('#spotifyErrorModal'),
  spotifyResultsModal: $('#spotifyResultsModal'),
  successModal: $('#successModal'),

  previewContainer: $('.tracklist-preview-container'),

  spotifyResultsContainer: $('#spotifyResultsContainer')
}

/**
 * Runs a test on the input using the selected regex.
 * @param {*} event 
 */
const testRegex = (event) => {
  const regex = new RegExp(ui.selector.children(':selected').data('regex'))
  const input = ui.trackList.val()

  const tracks = input.split('\n')
  let match
  let output = ''
  tracks.forEach(track => {
    if (match = regex.exec(track)) {
      // Found a match, add it to output.
      output += `${match[1].trim()} - ${match[2].trim()}\n`
    }
  })

  ui.preview.val(output)
}

const inputChanged = (event) => {
  const content = ui.trackList.val()
  ui.previewContainer.toggle(content.trim() !== '')
  ui.preview.val('')
  if (content.trim() !== '') {
    testRegex()
  }
}

const grabYouTubeTracks = () => {
  const youtubeUrl = ui.youtubeUrl.val().trim()
  const videoID = extractYouTubeID(youtubeUrl)
  if (youtubeUrl === '' || !videoID) {
    return
  }

  $.get('/youtube', {
    id: videoID
  }, extractTrackList)
}

const extractTrackList = obj => {
  const items = obj.items
  if (items.length > 0) {
    const description = items[0].snippet.description
    ui.trackList.val(description)
  } else {
    ui.trackList.val('')
    ui.errorModal.modal('show')
  }
  inputChanged()
}

const extractYouTubeID = url => {
  const regex = new RegExp('[\?&]v=(.*)$')
  return regex.exec(url)[1] || false
}

/**
 * Communicates with Spotify for the list of given tracks.
 * @param {*} event 
 */
const processTracks = () => {
  const tracks = ui.preview.val()

  // Show the Now Searching modal...
  ui.searchingModal.modal('show')
  
  if (!tracks) {
    ui.spotifyErrorModal.modal()
  } else {
    searchTracks(tracks)
      .then(displayTracks)
      .done(complete)
  }
}

const searchTracks = tracks => {
  return $.get('/searchTracks', {
    tracklist: tracks
  })
}

/**
 * Set the content of the search results modal and show it.
 * @param {*} data 
 * @param {*} textStatus 
 * @param {*} jqXHR 
 */
const displayTracks = (data, textStatus, jqXHR) => {
  ui.spotifyResultsContainer.html(data)
  ui.spotifyResultsModal.modal('show', {
    backdrop: 'static'  // clicking on the backdrop doesn't close modal.
  })
}

const complete = () => {
  ui.searchingModal.modal('hide')
}

const saveTracks = () => {
  const playlistMethod = $('input[name=playlistMethod]:checked').val()
  const playlistId = $('#playlistSelector').val()
  const playlistName = $('#newPlaylistName').val()
  const selectedTracks = $('.found-track-selection')
  let trackArray = []

  _.forEach(selectedTracks, track => {
    if (track.checked) {
      trackArray.push(track.dataset.trackId)
    }
  })

  const requestOpts = {
    method: playlistMethod,
    playlistId: playlistId,
    playlistName: playlistName,
    trackArray: trackArray
  }

  addTracksToPlaylist(requestOpts)
    .done(doneAddingTracks)
    .catch(handleError)
  
  return true
}

const addTracksToPlaylist = requestOps => {
  return $.get('/addTracksToPlaylist', { options: requestOps })
}

const doneAddingTracks = res => {
  console.log('Done adding tracks: ', res)
  const response = JSON.parse(res)

  if (response.succeed) {
    ui.successModal.modal('show')
  } else {

  }
}

const handleError = err => {
  console.error('An error was hit: ', err)
}

module.exports = {
  inputChanged: inputChanged,
  grabYouTubeTracks: grabYouTubeTracks,
  processTracks: processTracks,
  saveTracks: saveTracks
}