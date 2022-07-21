# fastify-session-better-sqlite3-store

![ci](https://github.com/mrdcvlsc/fastify-session-better-sqlite3-store/actions/workflows/ci.yml/badge.svg)
![standard](https://github.com/mrdcvlsc/fastify-session-better-sqlite3-store/actions/workflows/standard.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Session store for [@fastify/session](https://github.com/fastify/session) using [better-sqlite3](https://github.com/WiseLibs/better-sqlite3). By default [@fastify/session](https://github.com/fastify/session) stores sessions in-memory. Using this package's class you can store sessions on an **SQLite3** database instead.

## Installation

```
npm install fastify-session-better-sqlite3-store
```

## Example

Use with `fastify-session`'s `store` property.

```js
const fastify = require('fastify')({logger:true})
const fastifyCookie = require('@fastify/cookie')
const fastifySession = require('@fastify/session')
const db = require('better-sqlite3')(`./sqlite.db`)

// require module
const SqliteStore = require('fastify-session-better-sqlite3-store')

fastify.register(fastifyCookie)
fastify.register(fastifySession,{
  // ...
  // other session options
  // ...
  store: new SqliteStore(db)
})
```

-----

## Package-Status

*premature, there are a lot of rooms for improvement*

-----

## License

[MIT Licence](https://github.com/mrdcvlsc/fastify-session-better-sqlite3-store/blob/main/LICENSE)