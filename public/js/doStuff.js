const _ = require('lodash')

const doIt = toWhat => {
  return _.capitalize(toWhat.replace('this', 'that'))
}

module.exports = {
  doIt: doIt
}