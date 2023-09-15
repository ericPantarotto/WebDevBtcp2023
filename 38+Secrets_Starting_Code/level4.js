import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import * as db from "./db.js";
import md5 from "md5";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {
  const newUser = new db.User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  newUser
    .save()
    .then(res.render("secrets"))
    .catch(function (error) {
      console.warn(error);
    });
});

app.post("/login", function (req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  const hashedPassword = md5(req.body.password);


  db.User.findOne({ email: userName })
    .then((found) => {
      if (found && found.password === hashedPassword) {
        res.render("secrets");
      } else {
        res.redirect("/login");
      }
    })
    .catch(function (err) {
      console.warn(err);
    });
});

const PORT =
  parseInt(process.argv.slice(2)[0]) || parseInt(process.env.PORT) || 3000;
app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
