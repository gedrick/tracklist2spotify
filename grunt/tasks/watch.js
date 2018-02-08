// https://www.npmjs.com/package/grunt-contrib-watch

const watch = {
    watch: {
        css: {
            files: ['public/css/**/*.styl'],
            tasks: ['stylus']
        }
    }
}

module.exports = watch