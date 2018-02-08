const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('howdy')
})

// app.post('/newPlaylist', (req, res) => {
// res.send('invalid')
// })

const server = app.listen(3000, () => {
  console.log(`server operating on port ${server.address().port}`)
})