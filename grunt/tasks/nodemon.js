const nodemon = {
  dev: {
    script: 'index.js',
    options: {
      // nodeArgs: ['--debug'],
      ignore: ['node_modules/**/*.js', 'public/js/**/*.js'],
      callback: (nodemon) => {
        nodemon.on('restart', (event) => {
          console.log('changes detected - restarting')
        })
      }
    }
  }
}

module.exports = nodemon