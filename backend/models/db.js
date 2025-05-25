const mysql = require("mysql2");

const db = mysql.createPool({
  host: "webcourse.cs.nuim.ie",
  user: "p250144",
  password: "Fodai5fei9shohm2",
  database: "cs230_p250144",
});

module.exports = db;
