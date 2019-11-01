const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = express();
const mustache = mustacheExpress();
mustache.cache = null;
app.engine("mustache", mustache);
app.set("view engine", "mustache");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/add", (req, res) => {
  res.render("tasks-form");
});

app.get("/tasks", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  });
  client
    .connect()
    .then(() => {
      const sql = "SELECT * FROM tasks";
      return client.query(sql);
    })
    .then(results => {
      res.render(process.env.DATABASE, results);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/tasks/edit/:id", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  });
  client
    .connect()
    .then(() => {
      const sql = "SELECT * FROM tasks WHERE id=$1";
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then(results => {
      res.render("tasks-edit", { tsk: results.rows[0] });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/tasks/add", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  });

  client
    .connect()
    .then(() => {
      const sql =
        "INSERT INTO tasks (name, duration, description) VALUES ($1, $2, $3)";
      const params = [req.body.name, req.body.duration, req.body.description];
      return client.query(sql, params);
    })
    .then(result => {
      res.redirect("/tasks");
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/tasks/edit/:id", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  });

  client
    .connect()
    .then(() => {
      const sql =
        "UPDATE tasks SET name=$1, duration=$2, description=$3 WHERE id=$4";
      const params = [
        req.body.name,
        req.body.duration,
        req.body.description,
        req.params.id
      ];
      return client.query(sql, params);
    })
    .then(result => {
      res.redirect("/tasks");
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/tasks/delete/:id", (req, res) => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
  });

  client
    .connect()
    .then(() => {
      const sql = "DELETE FROM tasks WHERE id=$1";
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then(result => {
      res.redirect("/tasks");
    })
    .catch(err => {
      console.log(err);
    });
});

const port = 5500;
app.listen(port, () => {
  console.log(`Server is on at port ${port}`);
});
