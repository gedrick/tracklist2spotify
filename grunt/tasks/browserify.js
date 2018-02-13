// https://www.npmjs.com/package/grunt-browserify

const browserify = {
  options: {
    alias: {
      'jquery': './static/js/jquery.min.js'
    }
  },
  browserifyOptions: {
    dest: 'build/bundle.min.js',
    src: [
      'static/js/*.js',
      'public/js/**/*.js'
    ]
  }
}

module.exports = browserify