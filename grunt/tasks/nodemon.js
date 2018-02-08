const nodemon = {
    dev: {
      script: 'index.js',
      options: {
        // nodeArgs: ['--debug'],
        callback: (nodemon) => {
          nodemon.on('restart', (event) => {
            console.log('changes detected - restarting')
          })
        }
      }
    }
  }

module.exports = nodemon