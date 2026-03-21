/**
 * File: db.js
 * Description: Reusable cached PostgreSQL connection pool to avoid creating new
 * connections on every request. In development, the pool is stored on the global
 * object so Next.js hot-module reloads don't create duplicate pools. In production
 * the module cache handles it naturally.
 */

import postgres from 'postgres';

const DATABASE_URL = `postgres://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBURL}:${process.env.DBPORT}/${process.env.DBNAME}`;

const poolOptions = {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
};

let sql;

if (process.env.NODE_ENV === 'development') {
  // In development, reuse the pool across HMR reloads via the global object
  if (!global._pgPool) {
    global._pgPool = postgres(DATABASE_URL, poolOptions);
  }
  sql = global._pgPool;
} else {
  // In production the module is only loaded once, so module-level is fine
  sql = postgres(DATABASE_URL, poolOptions);
}

export default sql;
