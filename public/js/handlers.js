const $ = require('jquery')
const _ = require('lodash')

const ui = {
  youtubeUrl: $('#youtube-url'),
  btnGrabTracks: $('#btn-grab-tracks'),
  
  trackList: $('#tracklist'),
  selector: $('#regex-select'),
  preview: $('#tracklist-preview'),

  previewContainer: $('.tracklist-preview-container')
}


/**
 * Queries Spotify for the list of given tracks.
 * @param {*} event 
 */
const processTracks = (event) => {
  console.log('processing tracks...')
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
  });

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

  $.get(`/youtube/${videoID}`, {
    id: videoID
  }, extractTrackList)
}

const extractTrackList = obj => {
  const items = obj.items
  if (items.length > 0) {
    const description = items[0].snippet.description
    ui.trackList.val(description)
  }
  inputChanged()
}

const extractYouTubeID = url => {
  const regex = new RegExp('[\?&]v=(.*)$')
  return regex.exec(url)[1] || false
}

module.exports = {
  processTracks: processTracks,
  inputChanged: inputChanged,
  grabYouTubeTracks: grabYouTubeTracks
}