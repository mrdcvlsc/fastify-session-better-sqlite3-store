const fastify = require('fastify')({ logger: true })
const fastifyCookie = require('@fastify/cookie')
const fastifySession = require('@fastify/session')
const sqlite3db = require('better-sqlite3')('./test/sqlite.db')

const SqliteStore = require('../index')

fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  secret: 'a super duper secret session string',
  cookie: {
    secure: false,
    maxAge: 5000
  },
  store: new SqliteStore(sqlite3db),
  saveUninitialized: false
})

fastify.get('/session', (request, reply) => {
  if (request.session.name) {
    reply.send(`session:${request.session.name}`)
  } else {
    reply.send('session:no-user')
  }
})

const { SmallTest, httpGetRequest, readJsonFile } = require('./SmallTest')

async function start () {
  const t = new SmallTest('TEST SET CASE 2')
  try {
    await fastify.listen({ port: 3001 })

    const cookie = await readJsonFile('test/cookie.json')
    const subject9 = await httpGetRequest(fastify, '/session', cookie)
    t.assertEqual('session existing after server restart', subject9.payload, 'session:subject9')

    await fastify.close()

    if (t.results()) {
      console.log(t.testName, '=> PASSED ALL TEST\n')
    } else {
      console.log(t.testName, '=> FAILED SOME TEST\n')
      process.exit(1)
    }
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
