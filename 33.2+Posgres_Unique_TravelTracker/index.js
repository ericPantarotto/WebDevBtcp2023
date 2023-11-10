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

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countriesFromDb = [];
  result.rows.forEach((code) => countriesFromDb.push(code.country_code));

  res.render("index.ejs", {
    countries: countriesFromDb,
    total: countriesFromDb.length,
  });
  await db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
