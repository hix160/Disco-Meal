const pool = require("./pool");

pool.query("DELETE FROM users;");
pool.query("SELECT setval('users_id_seq', 1, false);");
console.log("Users deleted and id reset")