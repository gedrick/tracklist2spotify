// https://www.npmjs.com/package/grunt-contrib-watch

const watch = {
    css: {
        files: ['public/css/**/*.styl'],
        tasks: ['stylus'],
        options: {
            reload: true
            // livereload: true
        }
    },
    js: {
      files: [
        'public/js/**/*.js',
        'static/**/*.js',
      ],
      tasks: ['browserify'],
      options: {
        reload: true
      }
    }
}

module.exports = watch