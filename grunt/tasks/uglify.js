const uglify = {
  options: {
    // sourceMap: true,
    // sourceMapName: 'build/client.map',
    // compress: true,
    mangle: false
  },
  my_target: {
    files: {
      'build/client.js': ['public/js/**/*.js']
    }
  }
}

module.exports = uglify