# fastify-session-better-sqlite3-store

![ci](https://github.com/mrdcvlsc/fastify-session-better-sqlite3-store/actions/workflows/ci.yml/badge.svg)
![standard](https://github.com/mrdcvlsc/fastify-session-better-sqlite3-store/actions/workflows/standard.yml/badge.svg)
![node version](https://img.shields.io/badge/node%20-%3E=%2014.x-brightgreen.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

A [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) session store for [@fastify/session](https://github.com/fastify/session). By default [@fastify/session](https://github.com/fastify/session) uses in-memory storage to store sessions. With this small package you can store sessions on an **SQLite3** database instead.

## Installation

```
npm install fastify-session-better-sqlite3-store
```

## Example

Use with `fastify-session`'s `store` property.

```js
const fastify = require('fastify')({ logger: true })
const fastifyCookie = require('@fastify/cookie')
const fastifySession = require('@fastify/session')
const db = require('better-sqlite3')('./sqlite.db')

// require module
const SqliteStore = require('fastify-session-better-sqlite3-store')

fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  store: new SqliteStore(db),
  // ...
  // other session options
  // ...
})
```

-----

## License

[MIT Licence](https://github.com/mrdcvlsc/fastify-session-better-sqlite3-store/blob/main/LICENSE)