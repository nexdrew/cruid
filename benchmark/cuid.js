const bench = require('nanobench')
const cuid = require('cuid')
const { ITERATIONS } = require('./utils')

bench(`id x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    cuid()
  }
  run.end()
})

bench(`slug x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    cuid.slug()
  }
  run.end()
})

bench(`fingerprint x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    cuid.fingerprint()
  }
  run.end()
})
