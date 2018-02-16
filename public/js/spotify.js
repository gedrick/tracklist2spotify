const Promise = require('bluebird')
const Cookie = require('cookie-cutter')

const searchTracks = trackList => {
  const cookies = Cookie.get('authCode') || false
  if (!cookies) {
    return false
  } else {
    executeSearch(trackList)
  }
}

executeSearch = () => {
  return false
}

module.exports = {
  searchTracks: searchTracks
}