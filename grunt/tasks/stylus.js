// https://www.npmjs.com/package/grunt-contrib-stylus

const stylus = {
  stylesheets: {
    options: {
      compress: false
    },
    files: {
      'build/styles.css': [
        'static/css/*.styl',
        'public/css/**/*.styl'
      ]
    }
  }
}

module.exports = stylus