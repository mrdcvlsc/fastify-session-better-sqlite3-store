# fastify-better-sqlite3-session-store

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![standard](https://github.com/mrdcvlsc/fastify-better-sqlite3-session-store/actions/workflows/standard.yml/badge.svg)

A simple session store for fastify-session using better-sqlite3

## Status : [**WIP**]

Use with **fastify-session**'s `store` property.

```js
const fastify = require('fastify')({logger:true})
const fastifyCookie = require('@fastify/cookie')
const fastifySession = require('@fastify/session')
const db = require('better-sqlite3')(`./sqlite.db`)

// require module
const sqliteStore = require('fastify-better-sqlite3-session-store');

fastify.register(fastifyCookie);
fastify.register(fastifySession,{
  // ...
  // other session options
  // ...
  store: new sqliteStore(db)
})
```