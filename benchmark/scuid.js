const bench = require('nanobench')
const scuid = require('scuid')
const { ITERATIONS } = require('./utils')

bench(`id x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    scuid()
  }
  run.end()
})

bench(`slug x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    scuid.slug()
  }
  run.end()
})

bench(`fingerprint x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    scuid.fingerprint()
  }
  run.end()
})
