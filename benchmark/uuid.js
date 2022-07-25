const crypto = require('crypto')
const os = require('os')
const bench = require('nanobench')
const { ITERATIONS } = require('./utils')

bench(`id x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    crypto.randomUUID()
  }
  run.end()
})

bench(`slug x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    crypto.randomUUID()
  }
  run.end()
})

bench(`fingerprint x ${ITERATIONS}`, run => {
  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    os.hostname()
  }
  run.end()
})
