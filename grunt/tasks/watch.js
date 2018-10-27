// https://www.npmjs.com/package/grunt-contrib-watch

const watch = {
    css: {
        files: [
          'public/css/**/*.styl',
          'static/css/*.css'
        ],
        tasks: ['stylus'],
        options: {
            reload: true
            // livereload: true
        }
    },
    js: {
      files: [
        'public/js/**/*.js',
        'static/js/*.js',
      ],
      tasks: ['browserify'],
      options: {
        reload: true
      }
    }
    // templates: {
    //   files: [
    //     'public/views/**/*.dust'
    //   ],
    //   tasks: ['dusthtml'],
    //   options: {
    //     reload: true
    //   }
    // }
}

module.exports = watch