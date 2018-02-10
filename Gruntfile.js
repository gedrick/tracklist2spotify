const stylus = require('./grunt/tasks/stylus')
const nodemon = require('./grunt/tasks/nodemon')
const watch = require('./grunt/tasks/watch')
const concurrent = require('./grunt/tasks/concurrent');

const config = (grunt) => {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    stylus: stylus,

    // Set up to be used by grunt-concurrent.
    nodemon: nodemon,
    watch: watch,

    concurrent: concurrent
  })

  grunt.registerTask('default', ['stylus', 'concurrent'])
  // grunt.registerTask('default', ['concurrent', 'stylus'])
  // grunt.registerTask('default', ['nodemon:dev', 'stylus', 'watch'])
}

module.exports = config