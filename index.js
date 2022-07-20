'use strict'

const EventEmitter = require('events')

class SqliteStore extends EventEmitter {
  /**
   * @param {Object} sqlite3db database instance of better-sqlite3.
   * @param {string} table table name where session data will be stored, defaults to `session`.
   */
  constructor (sqlite3db, table = 'session') {
    try {
      sqlite3db.exec(`
        create table ${table} (
          sid TEXT PRIMARY KEY NOT NULL,
          expires DATETIME NOT NULL,
          session TEXT NOT NULL
        )`
      )
    } catch (err) {
      if (err.toString() !== 'SqliteError: table session already exists') {
        throw Error(err.toString())
      }
    }
    super()
    this.setSession = sqlite3db.prepare(`INSERT INTO ${table} (sid, expires, session) VALUES (?, ?, ?)`)
    this.getSession = sqlite3db.prepare(`SELECT sid, expires, session FROM ${table} WHERE sid = ?`)
    this.destroySession = sqlite3db.prepare(`DELETE FROM ${table} WHERE sid = ?`)
  }
}

SqliteStore.prototype.set = function set (sessionId, session, callback) {
  try {
    this.setSession.run(
      sessionId,
      session.expires.toISOString(),
      JSON.stringify(session)
    )
    callback(null)
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      callback(null)
    } else {
      callback(err)
    }
  }
}

SqliteStore.prototype.get = function get (sessionId, callback) {
  try {
    const results = []
    for (const row of this.getSession.iterate(sessionId)) {
      results.push(row)
    }

    let session = null
    if (results.length === 1) {
      const found = JSON.parse(results[0].session)
      if (found.expires) {
        if (new Date() < new Date(found.expires)) {
          session = found
        }
      } else {
        session = found
      }
    }
    callback(null, session)
  } catch (err) {
    callback(err)
  }
}

SqliteStore.prototype.destroy = function destroy (sessionId, callback) {
  try {
    this.destroySession.run(sessionId)
    callback(null)
  } catch (err) {
    callback(err)
  }
}

module.exports = SqliteStore
