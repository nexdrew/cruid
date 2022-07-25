const test = require('ava')
const cruid = require('../')

const TIMEOUT = 60 * 1000

function noCollision (fn, iterations) {
  const ids = new Set()
  let id
  for (let i = 0; i < iterations; i++) {
    id = fn()
    if (ids.has(id)) return false
    ids.add(id)
  }
  return ids.size === iterations
}

test('cruid collision resistance', t => {
  t.timeout(TIMEOUT, `cruid collision check took more than ${TIMEOUT}ms`)
  t.true(noCollision(cruid, 2000000))
})

test('cruid.slug collision resistance', t => {
  t.timeout(TIMEOUT, `slug collision check took more than ${TIMEOUT}ms`)
  t.true(noCollision(cruid.slug, 1000000))
})
