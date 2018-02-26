'use strict'
const _ = require('lodash')

const buildFoundTrackObj = track => {
  const trackData = track.trackData
  return {
    resultFound: true,
    trackData: {
      artist: trackData.artists[0].name || '',
      album: trackData.album.name,
      track: trackData.name,
      trackId: trackData.id,
      trackUrl: trackData.external_urls.spotify,
      previewUrl: trackData.preview_url || null,
      albumArt: trackData.album.images[trackData.album.images.length - 1].url || ''
    }
  }
}

const buildUnknownTrackObj = track => {
  return {
    resultFound: false,
    trackData: {
      name: track.trackData
    }
  }
}

/**
 * Return only playlists of which the currently logged in user is the owner.
 * @param {*} data
 */
const prunePlaylists = data => {
  const username = data.body.href.match(/users\/([^\/]+)/)[1]
  data.body.items = _.filter(data.body.items, item => {
    return item.owner.id === username
  })

  return Promise.resolve(data)
}

module.exports = {
  buildFoundTrackObj,
  buildUnknownTrackObj,
  prunePlaylists
}