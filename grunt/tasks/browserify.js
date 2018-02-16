// https://www.npmjs.com/package/grunt-browserify

const browserify = {
  options: {
    browserifyOptions: {
      debug: true
    },
    alias: {
      'jquery': './static/js/jquery.min.js',
      'popper.js': './static/js/popper.js'
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