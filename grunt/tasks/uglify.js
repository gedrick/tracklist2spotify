const uglify = {
  options: {
    sourceMap: true,
    sourceMapName: 'build/client.map'
  },
  my_target: {
    files: {
      'build/client.min.js': ['public/js/scripts.js']
    }
  }
}

module.exports = uglify