'use strict'
const cookie = require('cookie')
const path = require('path')
const express = require('express')
const app = express()
const dust = require('dustjs-express')
const SpotifyWebApi = require('spotify-web-api-node')
const YouTube = require('youtube-node')
const ytlist = require('youtube-playlist')
const Spotify = require('./lib/spotify')
const Promise = require('bluebird')
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const request = require('request');
const crypto = require('crypto');

let configSettings = {};
if (process.env.NODE_ENV !== 'production') {
  configSettings = require('./config/settings.js');
}

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
var stateKey = 'spotify_auth_state';

// Encrypt / Decrypt
const algorithm = 'aes-256-ctr';
const password = process.env.SALT || configSettings.salt;
function encrypt(text){
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm, password)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

// Set up Spotify api.
const spotifyScopes = [
  'playlist-read-private', 
  'playlist-modify-private', 
  'playlist-modify-public'
];
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID || configSettings.clientId,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || configSettings.clientSecret,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || configSettings.redirectUri
})

// Set up dust templating.
app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'dust')
app.engine('dust', dust.engine())

app.use(express.static('build'));
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.cookies.access_token) {
    spotifyApi.setAccessToken(decrypt(req.cookies.access_token));  
  }
  next();
});

app.get('/', (req, res) => {
  if (req.cookies.access_token) {
    spotifyApi.getMe()
      .then(userData => {
        res.render('index', {
          userData: userData.body
        });
      });
  } else {
    res.render('index');
  }
})

app.get('/login', (req, res) => {
  var state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID || configSettings.clientId,
      scope: spotifyScopes.join(' '),
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI || configSettings.redirectUri,
      state: state,
      show_dialog: true
    }))
})

app.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.redirect('/');
})

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI || configSettings.redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer((process.env.SPOTIFY_CLIENT_ID || configSettings.clientId) + ':' + (process.env.SPOTIFY_CLIENT_SECRET || configSettings.clientSecret)).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;

        res.cookie('access_token', encrypt(access_token), { maxAge: 900000, httpOnly: true });
        res.redirect('/');
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// API calls
app.get('/youtube', (req, res) => {
  const youtube = new YouTube()
  const type = req.query.type;

  youtube.setKey(process.env.YOUTUBE_KEY || configSettings.youtubeKey)
  if (type === 'video') {
    youtube.getById(req.query.id, (error, result) => {
      if (error) {
        res.send(error)
      } else {
        res.send(result)
      }
    })
  } else {
    ytlist(req.query.id, 'name').then(result => {
      res.send(result);
    });
  }
})

app.get('/searchTracks', (req, res) => {
  const tracklist = req.query.tracklist
  console.log('/searchTracks:', tracklist);
  Promise.all([
    Spotify.searchTracks(spotifyApi, tracklist),
    Spotify.getPlaylists()
  ]).then(results => res.render('track-table', {
    tracks: results[0],
    playlists: results[1]
  }));
});

app.get('/addTracksToPlaylist', (req, res) => {
  const { method, playlistId, playlistName, trackArray } = req.query.options
  console.log('/addTracksToPlaylist:', trackArray);
  
  if (method === 'existingPlaylist') {
    spotifyApi.getMe()
      .then(data => spotifyApi.addTracksToPlaylist(data.body.id, playlistId, trackArray))
      .then(() => {
        res.send(JSON.stringify({ succeed: true, method: method }))
      })
      .catch(err => {
        res.send(JSON.stringify({ succeed: false, method: method, error: err }))
      })
  } else {
    spotifyApi.getMe()
      .then(data => spotifyApi.createPlaylist(data.body.id, playlistName, { 'public': false }))
      .then(data => spotifyApi.addTracksToPlaylist(data.body.owner.id, data.body.id, trackArray))
      .then(() => {
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