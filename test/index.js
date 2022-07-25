const os = require('os')
const test = require('ava')
const cruid = require('../')
const Cruid = cruid.Cruid

test('exports', t => {
  t.is(typeof cruid, 'function')
  t.is(typeof cruid.slug, 'function')
  t.is(typeof cruid.fingerprint, 'function')
  t.is(typeof cruid.createFingerprint, 'function')

  t.is(typeof Cruid.pad, 'function')
  t.is(typeof Cruid.hostId, 'function')
  t.is(typeof Cruid.fingerprint, 'function')
  t.is(typeof Cruid.defaults, 'function')
  t.is(typeof Cruid.get, 'function')
  t.is(typeof Cruid.constructor, 'function')
})

test('cruid', t => {
  const id = cruid()
  t.is(typeof id, 'string')
  t.true(id.length >= 25)
})

test('cruid.slug', t => {
  const s = cruid.slug()
  t.is(typeof s, 'string')
  t.true(s.length >= 7)
})

test('cruid.fingerprint', t => {
  const f = cruid.fingerprint()
  t.is(typeof f, 'string')
  t.is(f.length, 4)
  const f2 = cruid.fingerprint()
  t.is(f, f2)
})

test('cruid.createFingerprint', t => {
  const f = cruid.createFingerprint(0, 'hello', 16)
  t.is(f, '00fx')
  const f2 = cruid.createFingerprint(0, 'hello', 16)
  t.is(f, f2)

  const fs = [
    cruid.createFingerprint(),
    cruid.createFingerprint('1'),
    cruid.createFingerprint(null, 1),
    cruid.createFingerprint(null, 'x'),
    cruid.createFingerprint(null, null, '2'),
    cruid.createFingerprint(null, null, 'x')
  ]
  for (const fx of fs) {
    t.is(typeof fx, 'string')
    t.is(fx.length, 4)
  }
})

test('Cruid.pad', t => {
  t.is(Cruid.pad(), 'ed') // last two chars of 'undefined'
  t.is(Cruid.pad(null), 'll') // last two chars of 'null'
  t.is(Cruid.pad(''), '00')
  t.is(Cruid.pad('i', 'h'), 'hi')
  t.is(Cruid.pad('123', 'x'), '23')
  t.is(Cruid.pad('123', 'x', 5), 'xx123')
  t.is(Cruid.pad('123', 0, '5'), '00123')
})

test('Cruid.hostId', t => {
  const hid = Cruid.hostId()
  t.is(typeof hid, 'string')
  t.is(hid.length, 2)
  t.is(Cruid.hostId('hello'), 'fx')
  t.is(Cruid.hostId('localhost'), 's6')
})

test('Cruid.fingerprint', t => {
  const f = Cruid.fingerprint(1, 'localhost', 16)
  t.is(f, '01s6') // base only applies to pid, not hostname (?)
  const f2 = Cruid.fingerprint(1, 'localhost', 16)
  t.is(f, f2)

  const fs = [
    Cruid.fingerprint(),
    Cruid.fingerprint('1'),
    Cruid.fingerprint(null, 1),
    Cruid.fingerprint(null, 'x'),
    Cruid.fingerprint(null, null, '2'),
    Cruid.fingerprint(null, null, 'x')
  ]
  for (const fx of fs) {
    t.is(typeof fx, 'string')
    t.is(fx.length, 4)
  }
})

test('Cruid.defaults', t => {
  const d = Cruid.defaults()
  t.is(d.prefix, 'c')
  t.is(d.base, 36)
  t.is(d.blockSize, 4)
  t.is(d.fill, '0')
  t.is(d.pid, process.pid)
  t.is(d.hostname, os.hostname())
  t.is(d.rng, Math)
  t.is(d.timestampSize, 8)

  // can mutate returned object but not internal defaults
  d.prefix = 'd'
  d.base = 2
  d.blockSize = 8
  d.fill = 'x'
  d.pid = 0
  d.hostname = 'localhost'
  d.timestampSize = 10

  const d2 = Cruid.defaults()
  t.is(d2.prefix, 'c')
  t.is(d2.base, 36)
  t.is(d2.blockSize, 4)
  t.is(d2.fill, '0')
  t.is(d2.pid, process.pid)
  t.is(d2.hostname, os.hostname())
  t.is(d2.rng, Math)
  t.is(d2.timestampSize, 8)
})

test('Cruid.get', t => {
  const c = Cruid.get({
    prefix: 'b',
    base: 2,
    blockSize: 16,
    pid: 98719,
    hostname: 'localhost',
    fill: 'x',
    timestampSize: 16,
    rng: {
      random () {
        return 0.5
      }
    }
  })

  const id = c.id()
  t.is(id.slice(0, 33), 'b10000000000000001000000000000000')
  t.is(id.slice(-20), 'xxxxxxxxxxxxxxx011s6')
  t.is(id.length, 69)

  const id2 = c.id()
  t.is(id2.slice(0, 33), 'b10000000000000001000000000000000')
  t.is(id2.slice(-20), 'xxxxxxxxxxxxxxx111s6')
  t.is(id2.length, 69)
})

test('new Cruid', t => {
  const c = new Cruid({
    prefix: 'd',
    base: 16,
    blockSize: 8,
    pid: 1532,
    hostname: 'aws-x2',
    fill: '-',
    timestampSize: 10,
    rng: {
      random () {
        return 0.1
      }
    }
  })

  const id = c.id()
  t.is(id.slice(0, 17), 'd1999999919999999')
  t.is(id.slice(-12), '-------0fcgc')
  t.is(id.length, 39)

  const id2 = c.id()
  t.is(id2.slice(0, 17), 'd1999999919999999')
  t.is(id2.slice(-12), '-------1fcgc')
  t.is(id2.length, 39)
})
