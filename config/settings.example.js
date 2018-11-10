const settings = {
  clientId: '[your client ID]',
  clientSecret: '[your client secret]',
  redirectUri: 'http://localhost:3000/callback', // change for production
  // make sure you add this URL to your Spotify Developer profile
  youtubeKey: '[your youtube key for pulling tracklists]',
  salt: 'some_fancy_key'
}

module.exports = settings