'use strict'
const cookie = require('cookie')
const path = require('path')
const express = require('express')
const app = express()
const dust = require('dustjs-express')
const SpotifyWebApi = require('spotify-web-api-node')

// Set up Spotify api.
const scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public']
const state = 'some-state'
const spotifySettings = require('./config/settings.js')
const spotifyApi = new SpotifyWebApi(spotifySettings)

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
    authorized = true
  } else {
    authUrl = spotifyApi.createAuthorizeURL(scopes, state)
  }

  res.render('index', {
    name: 'gedrick',
    authUrl: authUrl,
    authorized: authorized
  })
})

app.get('/signin', (req, res) => {
  // Grab query parameters
  const authCode = req.query.code

  // Authorize the code
  spotifyApi.authorizationCodeGrant(authCode)
    .then(data => {
      res.setHeader('Set-Cookie', cookie.serialize('authCode', authCode, {
        maxAge: 60,
        httpOnly: true
      }));
      res.redirect('/')
    }, err => {
      console.log(`ERROR in authorizationCodeGrant: ${err.message}`)
      res.clearCookie('authCode')
      res.redirect('/')
    })
})

const server = app.listen(3000, () => {
  console.log(`server operating on port ${server.address().port}`)
})

// app.post('/searchTrack/:searchTerms', (req, res) => {
//   res.send('invalid')
// })

// app.post('/createPlaylist/:trackList', (req, res) => {
//   res.send('failed')
// })