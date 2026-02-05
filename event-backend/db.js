const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "database_web",
    password: "",
    port: 5432,
});

module.exports = pool;