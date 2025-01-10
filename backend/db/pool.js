
const {Pool} = require("pg");
require("dotenv").config();

module.exports = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT, //default postgresql port is 5432
})