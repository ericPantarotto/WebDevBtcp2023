// import dependencies
import bodyParser from "body-parser";
import express from "express";

// Create a new express application object
const app = express();
const port = 3000;

const toDos = [];
const toDosWork = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get("/test", (req, res) => {
  res.send("Hello");
});

app.get("/", (req, res) => {
  res.render("index.ejs", {
    name: "Today",
    todos: toDos,
  });
});

app.get("/work", (req, res) => {
  res.render("index.ejs", {
    name: "Work",
    todos: toDosWork,
  });
});

app.post("/", (req, res) => {
  if (req.body["title"] === "Today") {
    toDos.push(req.body["listItem"]);
    res.redirect("/");
  } else {
    toDosWork.push(req.body["listItem"]);
    res.redirect("/work");
  }
});

app.post("/clear", (req, res) => {
  console.log(req.body["clearListItem"]);
  var requestedtodoId = req.body["clearListItem"];
  var j = 0;
  if (req.body["title"] === "Today") {
    toDos.forEach((todo) => {
      j = j + 1;
      if (todo === requestedtodoId) {
        toDos.splice(j - 1, 1);
      }
    });
    res.redirect("/");
  } else {
    toDosWork.forEach((todo) => {
      j = j + 1;
      if (todo === requestedtodoId) {
        toDosWork.splice(j - 1, 1);
      }
    });
    res.redirect("/work");
  }
});

// run your application, so it listens on port 4444
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
