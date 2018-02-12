const $ = require('jquery')
const _ = require('lodash')
const ui = {
  selector: $('#regex-select'),
  input: $('.track-list'),
  output: $('.track-list-parsed')
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
  const input = ui.input.val()

  const tracks = input.split('\n')
  let match
  let output = ''
  tracks.forEach(track => {
    if (match = regex.exec(track)) {
      // Found a match, add it to output.
      output += `${match[1].trim()} - ${match[2].trim()}\n`
    }
  });

  ui.output.val(output)
}

module.exports = {
  processTracks: processTracks,
  testRegex: testRegex
}