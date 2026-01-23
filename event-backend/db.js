const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "database_web",
    password: "Christine410IKSL",
    port: 5432,
});

module.exports = pool;