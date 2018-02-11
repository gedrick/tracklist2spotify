const _ = require('lodash')
const doStuff = require('./doStuff')

const testFunction = (array) => {
  return `here is something for testing: ${_.reverse(array)}`
}

console.log(testFunction([1, 2, 3]))
console.log(doStuff.doIt('to this!'))