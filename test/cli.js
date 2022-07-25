const cp = require('child_process')
const path = require('path')
const util = require('util')
const test = require('ava')

const execFile = util.promisify(cp.execFile)
const FILE = path.resolve(__dirname, '..', 'cli.js')

async function exec (args) {
  const result = await execFile(FILE, args?.split(/\s/))
  return { ...result, values: result.stdout?.split('\n').filter(Boolean) }
}

function assert (t, result, isSlug, num) {
  t.plan(num + 2)
  t.falsy(result.stderr)
  t.is(result.values.length, num)
  for (const v of result.values) {
    if (isSlug) t.true(v.length >= 7 && v.length <= 10)
    else t.true(v.length >= 25)
  }
}

test('no args', async t => {
  const result = await exec()
  assert(t, result, false, 1)
})

test('positive num', async t => {
  const result = await exec('10')
  assert(t, result, false, 10)
})

test('slug short', async t => {
  const result = await exec('-s')
  assert(t, result, true, 1)
})

test('slug long', async t => {
  const result = await exec('--slug')
  assert(t, result, true, 1)
})

test('zero', async t => {
  const result = await exec('0')
  assert(t, result, false, 0)
})

test('slug short num', async t => {
  const result = await exec('-s 5')
  assert(t, result, true, 5)
})

test('slug long num', async t => {
  const result = await exec('--slug 5')
  assert(t, result, true, 5)
})

test('num slug short', async t => {
  const result = await exec('3 -s')
  assert(t, result, true, 3)
})

test('num slug long', async t => {
  const result = await exec('4 --slug')
  assert(t, result, true, 4)
})

test('ignore unknown args', async t => {
  const result = await exec('-x y foo')
  assert(t, result, false, 1)
})
