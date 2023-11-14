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
  database: "permalist",
  password: process.env.DB_PASSWORD,
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getAllItems() {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC;");
  return result.rows;
}
app.get("/", async (req, res) => {
  try {
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: await getAllItems(),
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  await db.query("UPDATE items SET title = $1 WHERE id= $2", [
    req.body.updatedItemTitle,
    req.body.updatedItemId,
  ]);

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await db.query("DELETE FROM items WHERE id= $1", [req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
