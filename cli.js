#!/usr/bin/env node

const cruid = require('./')

const SLUG_FLAGS = ['-s', '--slug']

function cli (args) {
  const values = []

  let isSlug = false
  let num = 1

  args = [].concat(args).filter(Boolean).map(String)
  for (const arg of args) {
    if (SLUG_FLAGS.includes(arg)) isSlug = true
    else if (!!arg.trim() && !isNaN(arg)) num = Number(arg)
  }

  let x
  for (let i = 0; i < num; i++) {
    if (isSlug) x = cruid.slug()
    else x = cruid()

    values.push(x)
  }

  return values
}

module.exports = cli

function main (args) {
  const values = cli(args)
  for (const v of values) {
    console.log(v)
  }
}

if (require.main === module) main(process.argv.slice(2))
