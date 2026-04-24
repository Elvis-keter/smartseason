import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database('./db/crops.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  }
});

// Promise wrapper for db.all
export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Promise wrapper for db.get
export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Promise wrapper for db.run
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};


// import pg from 'pg';
// const { Pool } = pg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// export const dbAll = (sql, params = []) => {
//   return pool.query(sql, params).then(res => res.rows);
// };

// export const dbGet = (sql, params = []) => {
//   return pool.query(sql, params).then(res => res.rows[0]);
// };

// export const dbRun = (sql, params = []) => {
//   return pool.query(sql, params);
// };