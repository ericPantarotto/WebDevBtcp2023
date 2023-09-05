import bodyParser from "body-parser";
import express from "express";
import { rateLimit } from "express-rate-limit";
import store from "node-localstorage";
import passport from "passport";
import strategy from "passport-http-bearer";
// import db from "./db/indexdb.js";
import * as db from "./db/indexdb.js";

const localStorage = new store.LocalStorage("./scratch");
const app = express();
const port = 3000;

const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

export let functionalData = [];
//NOTE: to be able to update it while still using import/ export, it would havee to be instantiated
//and exported in the users module, and imported in this file 


// Auth methods
function computeFunctionalData() {
  const userJokes = db.users.getJokes() || [];
  functionalData = jokes.concat(userJokes);
}

passport.use(
  new strategy.Strategy(function (token, cb) {
    db.users.findByToken(token, function (err, user) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      computeFunctionalData();
      return cb(null, user);
    });
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (localStorage.getItem(username)) {
    res.status(401).json({ error: "Username is already taken." });
  } else {
    localStorage.setItem(username, password);
    res.status(200).json({ success: "Successfully registered." });
  }
});

app.post("/get-auth-token", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!localStorage.getItem(username)) {
    res.status(404).json({ error: "User does not exist." });
  } else {
    const token = db.users.checkAlreadyHasToken(username);
    if (token) {
      res
        .status(404)
        .json({ error: "User has already issued token", token: token });
    } else {
      if (localStorage.getItem(username) === password) {
        const token = crypto.randomUUID();
        db.users.addRecord(username, token);
        res.status(200).json({ token: token });
      } else {
        res.status(401).json({ error: "Incorrect password." });
      }
    }
  }
});
//1. GET a random joke
app.get(
  "/random",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    const randomIndex = Math.floor(Math.random() * functionalData.length);
    res.json(functionalData[randomIndex]);
  }
);

//2. GET a specific joke
app.get(
  "/jokes/:id",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    const id = req.params.id;
    const joke = functionalData.find((joke) => joke.id === parseInt(id));
    joke
      ? res.json(joke)
      : res.status(404).json({ error: "Joke not found for the given id." });
  }
);

//3. GET a jokes by filtering on the joke type
app.get(
  "/filter",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    // const type = new URLSearchParams(req._parsedUrl.search).get("type");
    const type = req.query.type;
    const jokeList = functionalData.filter((joke) => joke.jokeType === type);
    jokeList
      ? res.json(jokeList)
      : res
          .status(404)
          .json({ error: `Joke not found for the given type: '${type}'` });
  }
);
//4. POST a new joke
app.post(
  "/jokes",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    const newId = functionalData.length + 1;

    const newData = {
      id: newId,
      jokeText: req.body.text,
      jokeType: req.body.type,
    };

    db.users.addJoke(newData);
    computeFunctionalData();
    console.log(functionalData.slice(-1));
    res.status(200).json(newData);
  }
);
//5. PUT a joke
app.put(
  "/jokes/:id",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    const id = parseInt(req.params.id);
    const newData = {
      id: id,
      jokeText: req.body.text,
      jokeType: req.body.type,
    };

    if (db.users.updateRecord(id, newData)) {
      computeFunctionalData();
      res.status(200).json(newData);
    } else {
      res.status(404).json({
        error: `Cannot update resource, joke with id ${id} not found.`,
      });
    }
  }
);
//6. PATCH a joke
app.patch("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingJoke = functionalData.find((joke) => joke.id === id);
  const replacementJoke = {
    id: id,
    jokeText: req.body.text || existingJoke.jokeText,
    jokeType: req.body.type || existingJoke.jokeType,
  };

  if (db.users.updateRecord(id, replacementJoke)) {
    computeFunctionalData();
    res.status(200).json({ replacementJoke });
  } else {
    res.status(404).json({ error: "Cannot update record." });
  }
});
//7. DELETE Specific joke
app.delete(
  "/jokes/:id",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    const searchId = parseInt(req.params.id);
    const result = db.users.deleteSecretWithId(searchId);
    if (result) {
      res.status(200).json({
        message: `joke with ID ${searchId} has been deleted successfully.`,
      });
    } else {
      res.status(404).json({
        error: `There was an issue deleting this resource.`,
      });
    }
  }
);
//8. DELETE All jokes
app.delete(
  "/jokes",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    db.users.deleteAllJokes();
    res
      .status(200)
      .json({ message: "all jokes have been deleted successfully." });
  }
);

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

var jokes = [
  {
    id: 1,
    jokeText:
      "Why don't scientists trust atoms? Because they make up everything.",
    jokeType: "Science",
  },
  {
    id: 2,
    jokeText:
      "Why did the scarecrow win an award? Because he was outstanding in his field.",
    jokeType: "Puns",
  },
  {
    id: 3,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 4,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 5,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 6,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 7,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 8,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 9,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 10,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 11,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 12,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 13,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 14,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 15,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 16,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 17,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 18,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 19,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 20,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 21,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 22,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 23,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 24,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 25,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 26,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 27,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 28,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 29,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 30,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 31,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 32,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 33,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 34,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 35,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 36,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 37,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 38,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 39,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 40,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 41,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 42,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 43,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 44,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 45,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 46,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 47,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 48,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 49,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 50,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 51,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 52,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 53,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 54,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 55,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 56,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 57,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 58,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 59,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 60,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 61,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 62,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 63,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 64,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 65,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 66,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 67,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 68,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 69,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 70,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 71,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 72,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 73,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 74,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 75,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 76,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 77,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 78,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 79,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 80,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 81,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 82,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 83,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 84,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 85,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 86,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 87,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
  {
    id: 88,
    jokeText: "Why did the tomato turn red? Because it saw the salad dressing!",
    jokeType: "Food",
  },
  {
    id: 89,
    jokeText:
      "What do you get when you cross a snowman and a vampire? Frostbite!",
    jokeType: "Wordplay",
  },
  {
    id: 90,
    jokeText:
      "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    jokeType: "Sports",
  },
  {
    id: 91,
    jokeText:
      "Why are ghosts bad at lying? Because you can see right through them!",
    jokeType: "Wordplay",
  },
  {
    id: 92,
    jokeText: "Why can't you give Elsa a balloon? Because she will let it go.",
    jokeType: "Movies",
  },
  {
    id: 93,
    jokeText:
      "I'm reading a book about anti-gravity. It's impossible to put down!",
    jokeType: "Science",
  },
  {
    id: 94,
    jokeText:
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    jokeType: "Puns",
  },
  {
    id: 95,
    jokeText:
      "What did one ocean say to the other ocean? Nothing, they just waved.",
    jokeType: "Wordplay",
  },
  {
    id: 96,
    jokeText:
      "Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.",
    jokeType: "Wordplay",
  },
  {
    id: 97,
    jokeText: "How do you organize a space party? You planet!",
    jokeType: "Science",
  },
  {
    id: 98,
    jokeText:
      "Why don't some couples go to the gym? Because some relationships don't work out.",
    jokeType: "Puns",
  },
  {
    id: 99,
    jokeText:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    jokeType: "Math",
  },
  {
    id: 100,
    jokeText: "What do you call fake spaghetti? An impasta!",
    jokeType: "Food",
  },
];
