import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

//NOTE: postgreSQL
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: process.env.DB_PASSWORD,
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = await getAllUsers();

async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries where user_id = $1",
    [currentUserId]
  );

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
async function getCurrentUser() {
  const userFound = await db.query("SELECT * FROM users WHERE id = $1;", [
    currentUserId,
  ]);
  return userFound;
}

async function getAllUsers() {
  return (await db.query("SELECT * FROM users;")).rows;
}
app.get("/", async (req, res) => {
  const currentUser = await getCurrentUser();

  const countries = await checkVisisted();

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.rows[0].color,
  });
});

app.post("/add", async (req, res) => {
  let input = req.body.country.trim().toLowerCase();
  const countryFound = await db.query(
    "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
    [input]
  );

  const userFound = await getCurrentUser();

  if (countryFound.rowCount == 0) {
    const countries = await checkVisisted();

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country doesn't exist, try again.",
      users: users,
      color: userFound.rows[0].color,
    });
  } else {
    const userCountry = await db.query(
      "SELECT country_code FROM visited_countries where user_id = $1 and country_code = $2",
      [currentUserId, countryFound.rows[0].country_code]
    );
    if (userCountry.rows == 0) {
      await db.query(
        "INSERT INTO visited_countries(country_code, user_id) VALUES ($1, $2)",
        [countryFound.rows[0].country_code, currentUserId]
      );
      res.redirect("/");
    } else {
      const countries = await checkVisisted();

      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
        users: users,
        color: userFound.rows[0].color,
      });
    }
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add) {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  if (req.body.color === undefined || req.body.name === undefined) {
    res.render("new.ejs");
  } else {
    const userExists = await db.query(
      "SELECT * FROM users WHERE LOWER(name) = $1;",
      [req.body.name.trim().toLowerCase()]
    );
    if (userExists.rowCount == 0) {
      const result = await db.query(
        "INSERT INTO users(name, color) VALUES ($1, $2) RETURNING id",
        [req.body.name, req.body.color]
      );
      users = await getAllUsers();
      currentUserId = result.rows[0].id;
    }
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
