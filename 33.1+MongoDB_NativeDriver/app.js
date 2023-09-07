const { MongoClient } = require("mongodb");
const assert = require("assert");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("fruitsDB");
    console.log("connection successful!");
    const fruits = database.collection("fruits");

    await fruits
      .insertMany([
        { name: "Apple", score: 8, review: "Great fruit" },
        { name: "Orange", score: 6, review: "Kinda sour" },
        { name: "Banana", score: 9, review: "Great stuff!" },
      ])
      .then((result) => {
        console.log("Successfully saved defult items to DB");
        assert.equal(3, result.insertedCount);
        assert.equal(true, result.acknowledged);
      })
      .catch(function (err) {
        console.log(err);
      });

    let query = { name: "Apple" };
    const fruit = await fruits.findOne(query);
    console.log(fruit);

    query = { score: { $lte: 8 } };
    const options = {
      sort: { score: -1 },
      projection: { _id: 0, score:1, name: 1, review: 1 },
    };
    const cursor = await fruits.find(query, options);
    if ((await fruits.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }
    for await (const doc of cursor) {
      console.dir(doc);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close(); 
  }
}
run().catch(console.dir);
