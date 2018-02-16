const Promise = require('bluebird')
const _ = require('lodash')
let SpotifyApi

const searchResults = {}
const searchTracks = (spotifyApi, tracklist) => {
  SpotifyApi = spotifyApi
  const tracks = tracklist.split('\n')
  return Promise.mapSeries(tracks, doTrackLookup)
    .then(results => {
      console.log('Finished query tracks, results count: ', results.length)
      // Omit broken values from bad requests caused by blank lines.
      return cleanupJSON(_.pickBy(results))
    })
    .catch(err => {
      console.log('Error querying for tracks: ', err.message)
    })
}

const doTrackLookup = track => {
  if (_.isUndefined(track) || track.trim() === '') {
    return Promise.resolve()
  }

  const originalTrack = track
  return SpotifyApi.searchTracks(track)
    .then(data => {
      let trackData = {}
      if (data.body.tracks.total > 0) {
        trackData = data.body.tracks.items[0]
      } else {
        trackData = {
          originalTrack: originalTrack,
          results: 0
        }
      }
      return Promise.resolve(trackData)
    }, err => {
      console.log(`Error running searchTracks: ${err.message}`)
      return Promise.resolve()
    })
}

const cleanupJSON = tracklist => {
  // let cleanup = [tracklist] // Use this for dumping all data into feed.
  let cleanup = []
  _.each(tracklist, track => {
    if (_.isUndefined(track.originalTrack)) {
      cleanup.push({
        artist: track.artists[0].name || '',
        album: track.album.name || '',
        track: track.name || '',
        trackUrl: track.external_urls.spotify || '',
        previewUrl: track.preview_url || '',
        albumArt: track.album.images[track.album.images.length - 1].url || ''
      })
    } else {
      cleanup.push({
        artist: track.originalTrack
      })
    }
  })
  return cleanup
}

const createPlaylist = () => {

}

const addTrackToPlaylist = () => {

}

module.exports = {
  searchTracks: searchTracks,
  createPlaylist: createPlaylist,
  addTrackToPlaylist: addTrackToPlaylist
}