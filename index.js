const path = require('path')
const express = require('express')
const app = express()
const dust = require('dustjs-express')

// Set up dust templating.
app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'dust')
app.engine('dust', dust.engine());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/build'));

app.get('/', (req, res) => {
  res.render('index', {
    name: 'gedrick'
  })
})

app.post('/searchTrack/:searchTerms', (req, res) => {
  res.send('invalid')
})

app.post('/createPlaylist/:trackList', (req, res) => {
  res.send('failed')
})

const server = app.listen(3000, () => {
  console.log(`server operating on port ${server.address().port}`)
})