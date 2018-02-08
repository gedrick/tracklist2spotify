const nodemon = require('./grunt/tasks/nodemon')

const config = (grunt) => {
  grunt.initConfig({
    nodemon: nodemon
  })

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.registerTask('default', ['nodemon:dev'])
}

module.exports = config