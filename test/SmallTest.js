const fs = require('fs')

class SmallTest {
  constructor (testName) {
    this.verdicts = []
    this.names = []
    this.passing = true
    this.testName = testName
  }

  assertEqual (name, a, b) {
    this.names.push(name)
    const result = (a === b)
    this.verdicts.push(result ? 'PASSED' : 'FAILED')
    if (!result) this.passing = false
  }

  results () {
    console.log(`\n\nSmallTest : ${this.testName}\n`)
    if (this.verdicts.length === 0) {
      console.log('NO TESTS FOUND')
      return false
    }
    for (let i = 0; i < this.verdicts.length; ++i) {
      console.log(`  ${this.verdicts[i]} : ${this.names[i]}`)
    }
    return this.passing
  }
}

async function saveJsonFile (filename, json) {
  try {
    await fs.promises.writeFile(filename, JSON.stringify(json))
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}

async function readJsonFile (filename) {
  try {
    const json = JSON.parse(await fs.promises.readFile(filename))
    return Promise.resolve(json)
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * Simulate an http GET request, with session cookies.
 * @param {Object} fastify instance of fastify application.
 * @param {String} endpoint get request url.
 * @param {Object} clientSessionCookie client session cookie key pair value.
 * @returns {Promise<Response>}
 */
async function httpGetRequest (fastify, endpoint, clientSessionCookie) {
  try {
    const response = await fastify.inject({
      method: 'GET',
      url: endpoint,
      cookies: clientSessionCookie
    })
    return Promise.resolve(response)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function setTimeoutAsync (delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve()
    }, delay)
  })
}

module.exports = { httpGetRequest, saveJsonFile, readJsonFile, SmallTest, setTimeoutAsync }
