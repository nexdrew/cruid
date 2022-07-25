const bench = require('nanobench')
const cruid = require('../')
const { ITERATIONS } = require('./utils')

bench(`id x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    cruid()
  }
  run.end()
})

bench(`slug x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    cruid.slug()
  }
  run.end()
})

bench(`fingerprint x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    cruid.fingerprint()
  }
  run.end()
})
