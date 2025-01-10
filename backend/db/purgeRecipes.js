const pool = require("./pool");

pool.query("DELETE FROM recipes;");
pool.query("SELECT setval('recipes_id_seq', 1, false);");
console.log("Recipes deleted and id reset")