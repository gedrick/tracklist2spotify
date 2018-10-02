'use strict'
const cookie = require('cookie')
const path = require('path')
const express = require('express')
const app = express()
const dust = require('dustjs-express')
const SpotifyWebApi = require('spotify-web-api-node')
const YouTube = require('youtube-node')
const Spotify = require('./lib/spotify')
const Promise = require('bluebird')

// Set up Spotify api.
const state = 'some-state'
const configSettings = require('./config/settings.js')
const scopes = configSettings.spotifyScopes
const spotifyApi = new SpotifyWebApi({
  clientId: configSettings.clientId,
  clientSecret: configSettings.clientSecret,
  redirectUri: configSettings.redirectUri
})

// Set up dust templating.
app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'dust')
app.engine('dust', dust.engine())

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/build'))

app.get('/', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  let authorized = false
  let authUrl = ''

  if (cookies.authCode) {
    // The user has logged in already, set the authcode for all requests.
    authorized = true
  } else {
    // If the user isn't logged in, create an auth url for them to click.
    authUrl = spotifyApi.createAuthorizeURL(scopes, state)
  }

  if (authorized) {
    // Let's get the user data to render in the template.
    spotifyApi.getMe()
      .then(data => {
        // Render index with the userData to be used in the personalization section.
        return res.render('index', {
          userData: data.body,
          authorized: authorized
        })
      })
      .catch(err => {
        // They're no longer authorized. Let's kick them back to the homepage
        // and clear the authCode cookie so they can get a new one.
        console.log(`Error while querying spotify API: ${err.message}`)
        res.clearCookie('authCode')
        res.redirect('/')
      })
  } else {
    res.render('index', {
      authUrl: authUrl,
      authorized: authorized
    })
  }
})

app.get('/signin', (req, res) => {
  // Grab query parameters
  const authCode = req.query.code
  let cookies = []

  // Authorize the code
  spotifyApi.authorizationCodeGrant(authCode)
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token'])
      spotifyApi.setRefreshToken(data.body['refresh_token'])

      cookies.push(cookie.serialize('accessToken', data.body['access_token'], { maxAge: 60 * 60 * 60, httpOnly: true }))
      cookies.push(cookie.serialize('authCode', authCode, { maxAge: 60 * 60 * 60, httpOnly: true }))

      res.setHeader('Set-Cookie', cookies)
      res.redirect('/')
    }, err => {
      console.log(`ERROR in authorizationCodeGrant: ${err.message}`)
      res.clearCookie('authCode')
      res.redirect('/')
    })
})

app.get('/youtube', (req, res) => {
  const youtube = new YouTube()
  youtube.setKey(configSettings.youtubeKey)
  youtube.getById(req.query.id, (error, result) => {
    if (error) {
      res.send(error)
    } else {
      res.send(result)
    }
  })
})

app.get('/searchTracks', (req, res) => {
  const tracklist = req.query.tracklist
  Promise.all([
    Spotify.searchTracks(spotifyApi, tracklist),
    Spotify.getPlaylists()
  ]).then(results => {
    return res.render('track-table', {
      tracks: results[0],
      playlists: results[1]
    })
  })
})

app.get('/addTracksToPlaylist', (req, res) => {
  const { method, playlistId, playlistName, trackArray } = req.query.options
  let username = ''
  let respObj = { method: method }

  if (method === 'existingPlaylist') {
    spotifyApi.getMe()
      .then(data => { return spotifyApi.addTracksToPlaylist(data.body.id, playlistId, trackArray) })
      .then(results => {
        res.send(JSON.stringify({ succeed: true, method: method }))
      })
      .catch(err => {
        res.send(JSON.stringify({ succeed: false, method: method, error: err }))
      })
  } else {
    spotifyApi.getMe()
      .then(data => { return spotifyApi.createPlaylist(data.body.id, playlistName, { 'public': false }) })
      .then(data => { return spotifyApi.addTracksToPlaylist(data.body.owner.id, data.body.id, trackArray) })
      .then(results => {
        res.send(JSON.stringify({ succeed: true, method: method }))
      })
      .catch(err => {
        res.send(JSON.stringify({ succeed: false, method: method, error: err }))
      })
  }
})

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`server operating on port ${server.address().port}`)
})