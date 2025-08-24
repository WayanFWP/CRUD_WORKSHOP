const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

const server = 3213;

const database = mysql.createConnection({
  host: "localhost",
  user: "demo",
  password: "demo",
  database: "orixia",
});

database.connect((err) => {
  if (err) throw err;
  console.log("database connected brather");
});

// GET all user data
app.get("/api/t1/users", (_, res) => {
  database.query("SELECT * FROM user", (err, rows) => {
    if (err) throw err;
    res.json({
      success: true,
      messages: "getting users data",
      data: rows,
    });
  });
  console.log("API USER TRIGGER!");
});

// works on what port?
app.listen(server, () => {
  console.log("Server is running on port " + server);
});