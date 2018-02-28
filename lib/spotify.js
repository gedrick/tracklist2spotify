'use strict'
const Promise = require('bluebird')
const _ = require('lodash')
const utils = require('./utils')
let SpotifyApi

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
      // Return with track count and either the track details, or the original track 
      // to reference later and report as a failed lookup.
      let trackData = { 
        resultCount: data.body.tracks.total,
        trackData: data.body.tracks.items[0] || originalTrack
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
    // Create an object depending on whether or not a track was found. 
    // This will be pushed to the track-table template.
    if (track.resultCount === 0) {
      cleanup.push(utils.buildUnknownTrackObj(track))
    } else {
      cleanup.push(utils.buildFoundTrackObj(track))
    }
  })

  return cleanup
}

const getPlaylists = () => {
  return SpotifyApi.getMe()
    .then(getUserPlaylists)
    .then(utils.prunePlaylists)
    .then(result => {
      return {
        count: result.body.items.length,
        items: result.body.items
      }
    })
    .catch(err => {
      console.log('Error getting user playlists: ', err)
    })
}

const getUserPlaylists = data => {
  const userId = data.body.id
  return SpotifyApi.getUserPlaylists(userId, {
    limit: 50
  })
}

module.exports = {
  searchTracks,
  getPlaylists
}