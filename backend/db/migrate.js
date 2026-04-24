import sqlite3 from 'sqlite3';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const sqliteDb = new sqlite3.Database('./db/crops.db');
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Run migrations
async function migrate() {
  try {
    // Create tables in PostgreSQL
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('Admin', 'Agent')),
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS fields (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        crop_type VARCHAR(255) NOT NULL,
        planting_date DATE NOT NULL,
        current_stage VARCHAR(50) NOT NULL CHECK(current_stage IN ('Planted', 'Growing', 'Ready', 'Harvested')) DEFAULT 'Planted',
        status VARCHAR(50) NOT NULL CHECK(status IN ('Active', 'At Risk', 'Completed')) DEFAULT 'Active',
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables created successfully');
    await pgPool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();
