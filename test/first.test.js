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

fastify.get('/set/:name', (request, reply) => {
  request.session.name = request.params.name
  reply.send(`recorded:${request.session.name}`)
})

fastify.get('/destroy', async (request, reply) => {
  try {
    if (request.session.name) {
      const destroyedUser = request.session.name
      await request.session.destroy()
      return reply.send(`destroyed:${destroyedUser}`)
    } else {
      return reply.send('destroyed:no-user')
    }
  } catch (err) {
    fastify.log.error(err)
    return process.exit(1)
  }
})

fastify.get('/session', (request, reply) => {
  if (request.session.name) {
    reply.send(`session:${request.session.name}`)
  } else {
    reply.send('session:no-user')
  }
})

const { SmallTest, httpGetRequest, saveJsonFile, setTimeoutAsync } = require('./SmallTest')

async function start () {
  const t = new SmallTest('TEST SET CASE 1')
  try {
    await fastify.listen({ port: 3000 })

    const subject1 = await httpGetRequest(fastify, '/session')
    const subject2 = await httpGetRequest(fastify, '/set/subject2')
    const cookie1 = {
      sessionId: subject2.cookies[0].value
    }
    const subject3 = await httpGetRequest(fastify, '/session', cookie1)
    const subject4 = await httpGetRequest(fastify, '/destroy', cookie1)
    const subject5 = await httpGetRequest(fastify, '/session', cookie1)
    const subject6 = await httpGetRequest(fastify, '/set/subject6')
    const cookie2 = {
      sessionId: subject6.cookies[0].value
    }
    const subject7 = await httpGetRequest(fastify, '/session', cookie2)
    await setTimeoutAsync(8000)
    const subject8 = await httpGetRequest(fastify, '/session', cookie2)
    const subject9 = await httpGetRequest(fastify, '/set/subject9')
    const cookie3 = {
      sessionId: subject9.cookies[0].value
    }

    t.assertEqual('session none', subject1.payload, 'session:no-user')
    t.assertEqual('session recorded', subject2.payload, 'recorded:subject2')
    t.assertEqual('session existing', subject3.payload, 'session:subject2')
    t.assertEqual('session destroyed', subject4.payload, 'destroyed:subject2')
    t.assertEqual('session no more', subject5.payload, 'session:no-user')
    t.assertEqual('new session recorded', subject6.payload, 'recorded:subject6')
    t.assertEqual('new session existing', subject7.payload, 'session:subject6')
    t.assertEqual('new session expired', subject8.payload, 'session:no-user')
    t.assertEqual('session saved then server shutsdown', subject9.payload, 'recorded:subject9')

    await fastify.close()
    await saveJsonFile('test/cookie.json', cookie3)

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
