import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import * as db from "./db.js";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//NOTE: setting-up express-session
var newSession = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  newSession.cookie.secure = true; // serve secure cookies
}
app.use(session(newSession));
//----- ------------- ----- ------------- -----

//NOTE: setting-up Passport
app.use(passport.initialize());
app.use(passport.session());

db.connect();

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  await db.User.register({ username: req.body.username }, req.body.password)
    .then(async (user) => {
      await passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    })
    .catch(function (err) {
      console.warn(err);
      res.redirect("/register");
    });
});

// app.post("/login", async function (req, res) {
//   const user = new db.User({
//     email: req.body.username,
//     password: req.body.password,
//   });

//   req.login(user, function (err) {
//     if (err) {
//       console.log(err);
//       res.redirect("/register");
//     } else {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect("/secrets");
//       });
//     }
//   });
// });
//HACK: shifting the login/passport authenticate order to custum the behavior for wrong credentials
//note the usage of next which Angela's version did not make use of
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // default express error handler - unauthorized
    }

    if (!user) {
      return res.redirect("/"); // you can redirect user to signup page if needed
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/secrets");
    });
  })(req, res, next);
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

const PORT =
  parseInt(process.argv.slice(2)[0]) || parseInt(process.env.PORT) || 3000;
app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
