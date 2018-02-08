const nodemon = require('./grunt/tasks/nodemon')
const watch = require('./grunt/tasks/watch')
const stylus = require('./grunt/tasks/stylus')

const config = (grunt) => {
  grunt.initConfig({
    nodemon: nodemon,
    stylus: stylus,
    watch: watch
  })

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // grunt.registerTask('default', ['nodemon:dev', 'stylus', 'watch'])
  grunt.registerTask('default', ['stylus', 'watch'])
}

module.exports = config