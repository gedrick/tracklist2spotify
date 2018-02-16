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
  const content = event.currentTarget.innerHTML
  ui.previewContainer.toggle(content.trim() !== '')
  ui.preview.val('')
  if (content.trim() !== '') {
    testRegex()
  }
}

module.exports = {
  processTracks: processTracks,
  testRegex: testRegex,
  inputChanged: inputChanged
}