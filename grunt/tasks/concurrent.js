// https://github.com/sindresorhus/grunt-concurrent

const concurrent = {
  target: {
    tasks: ['nodemon', 'watch'],
    options: {
      logConcurrentOutput: true
    }
  }
}

module.exports = concurrent
