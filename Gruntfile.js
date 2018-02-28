const config = (grunt) => {
  // Auto load any modules named grunt-*
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    browserify: require('./grunt/tasks/browserify'),
    stylus: require('./grunt/tasks/stylus'),

    // Set up to be used by grunt-concurrent.
    nodemon: require('./grunt/tasks/nodemon'),
    watch: require('./grunt/tasks/watch'),

    // Runs nodemon and watch tasks concurrently.
    concurrent: require('./grunt/tasks/concurrent')
  })

  grunt.registerTask('dev', ['browserify', 'stylus', 'concurrent'])
  grunt.registerTask('prod', ['browserify', 'stylus'])
}

module.exports = config