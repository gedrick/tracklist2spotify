// https://www.npmjs.com/package/grunt-browserify

const browserify = {
  browserifyOptions: {
    dest: 'build/bundle.min.js',
    src: ['static/*.js', 'public/js/**/*.js']
  }
}

module.exports = browserify