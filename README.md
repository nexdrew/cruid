# cruid

> Collision-resistant distributed ids, optimized for Cockroach DB PKs

[![CI Status](https://github.com/nexdrew/cruid/workflows/CI/badge.svg?branch=main)](https://github.com/nexdrew/cruid/actions)
[![Coverage Status](https://coveralls.io/repos/github/nexdrew/cruid/badge.svg?branch=main)](https://coveralls.io/github/nexdrew/cruid?branch=main)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg)](https://conventionalcommits.org)

cruid is [cuid](https://github.com/ericelliott/cuid) for applications generating primary keys for [Cockroach DB](https://www.cockroachlabs.com/docs/). Instead of generating monotonically-increasing IDs (which are good for older relational databases but not great for Cockroach), cruid generates IDs that can be equally distributed amongst multiple Cockroach nodes.

cruid is modeled after [scuid](https://github.com/jhermsmeier/node-scuid) to achieve the same performance improvements over the legacy cuid package.

So why not use a [UUID](https://nodejs.org/dist/latest-v16.x/docs/api/crypto.html#cryptorandomuuidoptions) instead?

With cruid, you get the best of both worlds - the benefits of cuid (shorter values, HTML-friendly IDs, collision-resistance in a tight loop _and_ across different hosts) **and** the benefits of UUID (randomly distributed).

Let's compare:

| Feature               | cruid    | cuid     | scuid    | crypto.randomUUID() |
| --------------------- | -------- | -------- | -------- | ------------------- |
| Collision resistance  | ✅       | ✅       | ✅        | ✅                  |
| Default ID length     | 25 chars | 25 chars | 25 chars | 36 chars            |
| HTML-friendly IDs     | ✅       | ✅       | ✅        | ❌                  |
| Random distribution   | ✅       | ❌       | ❌        | ✅                  |
| Performance (approx)  | 5-10x    | 1x       | 5-10x    | 20-25x              |
| Configurable          | ✅       | ❌       | ✅        | ❌                  |
| Client fingerprinting | ✅       | ✅       | ✅        | ❌                  |
| Supports short slugs  | ✅       | ✅       | ✅        | ❌                  |

## Install

```
npm i --save cruid
```

## Usage

Basic examples:

```js
// ESM
import cruid from 'cruid'
// CommonJS
const cruid = require('cruid')

// generate id (using default config)
const id = cruid()
//=> 'cdfzrzm72l611rbr50000gunp'

// generate a shorter slug
const slug = cruid.slug()
//=> '20r01hp'
```

Advanced examples:

```js
// ESM
import { Cruid } from 'cruid'
// CommonJS
const { Cruid } = require('cruid')

// configure your own instance
// values shown are default but you can customize
const cruid = Cruid.get({
  prefix: 'c',             // static first char
  base: 36,                // radix for converting random integers to blocks
  blockSize: 4,            // num chars for each random block (2 random blocks per id)
  timestampSize: 8,        // num chars for timestamp block
  pid: process.pid,        // number for fingerprinting
  hostname: os.hostname(), // string for fingerprinting
  fill: '0',               // char for left-padding
  rng: Math                // needs `random()` function to generate value b/w 0 and 1
})

// generate id
const id = cruid.id()
//=> 'cc52tir8fl6122bhw0000ulnp'

// generate a shorter slug
const slug = cruid.slug()
//=> 'f5lf1gp'
```

## Structure

### ID

This is the value you should use as an application-generated primary key.

| Prefix | Random Block | Timestamp | Counter | Fingerprint |
| ------ | ------------ | --------- | ------- | ----------- |
| c      | dfzrzm72     | l611rbr5  | 0000    | gunp        |

The prefix is static for a given cruid instance.

The random block is 2 random values converted to base, sliced, and concatenated.

The timestamp is epoch time converted to base and sliced.

The counter allows for different IDs if the same client happens to generate the same random block and timestamp for multiple calls, however unlikely, depending on processor speed. The counter will roll over if the value gets too big.

The client fingerprint is a combination of "host id" (based on hostname) and process pid.

### Slug

A slug is a smaller (7-10 character) URL-friendly generated value. It **should not** be used as a primary key.

| Random Block | Timestamp | Counter | Fingerprint |
| ------------ | --------- | ------- | ----------- |
| 20           | r0        | 1       | hp          |

The counter may be 1 to 4 characters.

## License

MIT © 2016-2022 Jonas Hermsmeier and Andrew Goode

## Related

See Eric Elliott's original writeup on the [Motiviation](https://github.com/ericelliott/cuid#motivation) for cuid. The same rationale applies to cruid.

Read about [Cockroach best practices for generated IDs](https://www.cockroachlabs.com/docs/v22.1/performance-best-practices-overview#unique-id-best-practices). To allow your application to scale, consider generating IDs in your application code via cruid instead of depending on the database to generate them.
