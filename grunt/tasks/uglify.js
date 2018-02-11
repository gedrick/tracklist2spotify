// NOT CURRENTLY BEING USED

const uglify = {
  options: {
    mangle: false,
    sourceMap: true,
    sourceMapName: 'build/client.map'
  },
  my_target: {
    files: {
      'build/client.min.js': ['public/js/**/*.js']
    }
  }
}

module.exports = uglify