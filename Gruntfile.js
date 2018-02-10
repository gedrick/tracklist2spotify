const stylus = require('./grunt/tasks/stylus')
const nodemon = require('./grunt/tasks/nodemon')
const watch = require('./grunt/tasks/watch')
const concurrent = require('./grunt/tasks/concurrent')
const uglify = require('./grunt/tasks/uglify')

const config = (grunt) => {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    stylus: stylus,
    uglify: uglify,

    // Set up to be used by grunt-concurrent.
    nodemon: nodemon,
    watch: watch,

    // Runs nodemon and watch tasks concurrently.
    concurrent: concurrent
  })

  grunt.registerTask('default', ['stylus', 'uglify', 'concurrent'])
}

module.exports = config