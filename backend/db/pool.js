
const {Pool} = require("pg");
require("dotenv").config();

module.exports = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432, //default postgresql port is 5432
    ssl: {
        // Enable SSL connection
        rejectUnauthorized: false,
      },
})