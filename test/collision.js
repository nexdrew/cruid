const test = require('ava')
const cruid = require('../')

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

test('collision resistance', t => {
  const time = 120 * 1000
  t.timeout(time, `collision check took more than ${time}ms`)
  t.true(noCollision(cruid, 2000000))
  t.true(noCollision(cruid.slug, 1000000))
})
