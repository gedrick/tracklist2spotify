
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

const authUrl = spotifyApi.createAuthorizeURL(scopes, state)

// Set up dust templating.
app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'dust')
app.engine('dust', dust.engine())

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/build'))

app.get('/', (req, res) => {
  res.render('index', {
    name: 'gedrick',
    authUrl: authUrl
  })
})

app.get('/signin', (req, res) => {
  // Grab query parameters
  const code = req.query.code
  const state = req.query.state
  console.log(req.query)
  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      console.log(data)
      console.log('The token expires in ' + data.body['expires_in'])
      console.log('The access token is ' + data.body['access_token'])
      console.log('The refresh token is ' + data.body['refresh_token'])
      res.redirect('/')
    }, err => {
      res.status(err.code)
      res.send(err.message)
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