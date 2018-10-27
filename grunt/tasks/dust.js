// https://github.com/ehynds/grunt-dust-html

const dust = {
  dist: {
    src: 'public/views/index.dust',
    dest: 'build/index.html',

    options: {
      // see below for options. this is optional.
      module: 'dustjs-express'
    }
  }
}

module.exports = dust