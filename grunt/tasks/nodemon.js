const nodemon = {
  dev: {
    script: 'index.js',
    options: {
      nodeArgs: ['--inspect'],
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