const os = require('os')

const DEFAULT_FILL = '0'
const DEFAULT_BASE = 36
const DEFAULT_HALF_FP_LEN = 2

const DEFAULT_HOSTNAME = os.hostname()
const DEFAULT_PID = process.pid

class Cruid {
  static pad (string, fill, length) {
    string = String(string)
    length = parseInt(length, 10) || DEFAULT_HALF_FP_LEN
    return ((fill || DEFAULT_FILL).repeat(Math.max(length - string.length, 0)) + string).slice(-length)
  }

  static hostId (hostname) {
    hostname = String(hostname || DEFAULT_HOSTNAME)
    const hlen = hostname.length
    let int = hlen + DEFAULT_BASE
    for (let i = 0; i < hlen; i++) {
      int += hostname.charCodeAt(i)
    }
    return Cruid.pad(int.toString(DEFAULT_BASE), DEFAULT_FILL, DEFAULT_HALF_FP_LEN)
  }

  static fingerprint (pid, hostname, base) {
    pid = parseInt(pid, 10)
    if (Number.isNaN(pid)) pid = DEFAULT_PID
    return Cruid.pad(pid.toString(parseInt(base, 10) || DEFAULT_BASE), DEFAULT_FILL, DEFAULT_HALF_FP_LEN) + Cruid.hostId(hostname)
  }

  static defaults () {
    return {
      prefix: 'c',
      base: DEFAULT_BASE,
      blockSize: 4,
      fill: DEFAULT_FILL,
      pid: DEFAULT_PID,
      hostname: DEFAULT_HOSTNAME,
      rng: Math,
      timestampSize: 8
    }
  }

  static get (opts) {
    return new Cruid(opts)
  }

  constructor (opts) {
    const d = Cruid.defaults()
    this.prefix = opts?.prefix || d.prefix
    this.base = opts?.base || d.base
    this.blockSize = opts?.blockSize || d.blockSize
    this.discreteValues = Math.pow(this.base, this.blockSize)
    this.pid = opts?.pid || d.pid
    this.hostname = opts?.hostname || d.hostname
    this.fill = opts?.fill || d.fill
    this.rng = opts?.rng || d.rng
    this.timestampSize = opts?.timestampSize || d.timestampSize

    this._fingerprint = Cruid.fingerprint(this.pid, this.hostname, this.base)
    this._counter = 0
  }

  count () {
    this._counter = this._counter < this.discreteValues ? this._counter : 0
    return this._counter++
  }

  counter () {
    return Cruid.pad(this.count().toString(this.base), this.fill, this.blockSize)
  }

  randomBlock () {
    const block = this.rng.random() * this.discreteValues << 0
    return Cruid.pad(block.toString(this.base), this.fill, this.blockSize)
  }

  timestamp () {
    return Cruid.pad(Date.now().toString(this.base), this.fill, this.timestampSize)
  }

  fingerprint () {
    return this._fingerprint
  }

  id () {
    // default: 'c' + 4 random chars + 4 random chars + 8 ts chars + 4 counter chars + 4 fingerprint chars
    return this.prefix + this.randomBlock() + this.randomBlock() + this.timestamp() + this.counter() + this._fingerprint
  }

  slug () {
    // default: 2 random chars + 2 ts chars + (1 to 4 counter chars) + 2 fingerprint chars
    return this.randomBlock().slice(-2) + this.timestamp().slice(-2) + this.count().toString(this.base).slice(-4) + this._fingerprint[0] + this._fingerprint[this._fingerprint.length - 1]
  }
}

const singleton = Cruid.get()

module.exports = function cruid () {
  return singleton.id()
}

module.exports.slug = function slug () {
  return singleton.slug()
}

module.exports.fingerprint = function fingerprint () {
  return singleton.fingerprint()
}

module.exports.createFingerprint = function createFingerprint (pid, hostname, base) {
  return Cruid.fingerprint(pid, hostname, base)
}

module.exports.Cruid = Cruid
