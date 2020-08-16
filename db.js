const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = {
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const proConfig = {
  connnectionString: process.env.DATABASE_URL,
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? proConfig : devConfig
);

module.exports = pool;
