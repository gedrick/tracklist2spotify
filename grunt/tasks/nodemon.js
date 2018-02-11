const nodemon = {
  dev: {
    script: 'index.js',
    options: {
      // nodeArgs: ['--debug'],
      ignore: [
        'node_modules/**/*.js',
        'grunt/tasks/**/*.js',
        'public/js/**/*.js'
      ],
      callback: (nodemon) => {
        nodemon.on('restart', (event) => {
          console.log('restarting - changes detected: ' + event)
        })
      }
    }
  }
}

module.exports = nodemon