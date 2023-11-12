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

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted();

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
  });
});

app.post("/add", async (req, res) => {
  let input = req.body.country.trim().toLowerCase();
  const countryFound = await db.query(
    "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
    [input]
  );

  if (countryFound.rowCount == 0) {
    const countries = await checkVisisted();

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country doesn't exist, try again.",
    });
  } else {
    try {
      await db.query(
        "INSERT INTO visited_countries(country_code) VALUES ($1)",
        [countryFound.rows[0].country_code]
      );
      res.redirect("/");
    } catch (error) {
      console.log(error);
      const countries = await checkVisisted();

      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
