// https://www.npmjs.com/package/grunt-contrib-watch

const watch = {
    css: {
        files: ['public/css/**/*.styl'],
        tasks: ['stylus'],
        options: {
            reload: true
            // livereload: true
        }
    }
}

module.exports = watch