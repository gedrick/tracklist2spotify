// https://www.npmjs.com/package/grunt-contrib-stylus

const stylus = {
  stylesheets: {
    files: {
      'build/styles.css': [
        'static/css/*.css',
        'public/css/**/*.styl'
      ]
    }
  }
}

module.exports = stylus