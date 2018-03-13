const settings = {
  spotifyScopes: ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public'],
  clientId: '[your client ID]',
  clientSecret: '[your client secret]',
  redirectUri: 'http://localhost:3000/signin', // change for production
  // make sure you add this URL to your Spotify Developer profile
  youtubeKey: '[your youtube key for pulling tracklists]'
}

module.exports = settings