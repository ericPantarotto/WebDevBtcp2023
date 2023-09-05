var records = [];

export const findByToken = function (token, cb) {
  process.nextTick(function () {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];

      if (record.token === token) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};

export const addRecord = function (username, token) {
  records.push({
    username: username,
    token: token,
    jokes: [],
  });
};

export const addJoke = function (joke) {
  records[0].jokes.push(joke);
};

export const updateRecord = function (id, newData) {
  const joke = records[0].jokes.find((joke) => joke.id === parseInt(id));
  if (joke) {
    records[0].jokes[id - 101] = newData;
    return true;
  }
  return false;
};

export const checkAlreadyHasToken = function (username) {
  for (var i = 0, len = records.length; i < len; i++) {
    var record = records[i];

    if (record.username === username) {
      return record.token;
    } else {
      return false;
    }
  }
};

export const getJokes = function () {
  return records[0].jokes;
};

export const deleteSecretWithId = function (id) {
  var jokeIndex = records[0].jokes.findIndex((joke) => joke.id === id);
  if (jokeIndex > -1) {
    records[0].jokes.splice(jokeIndex, 1);
    return true;
  }
  return false;
};

export const deleteAllJokes = function () {
  // fd = []; //DEBUG: will throw an error
  records[0].jokes = [];
};
