import mongoose from "mongoose";

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/fruitsDB");

    const fruitSchema = new mongoose.Schema({
      name: String,
      // name: {
      //   type: String,
      //   required: [true, "Please check entry, no name specified!"]
      // },
      // rating: Number,
      rating: {
        type: Number,
        min: 1,
        max: 10,
      },
      review: String,
    });

    const Fruit = mongoose.model("Fruit", fruitSchema);

    // const fruit = new Fruit({
    //   name: "Apple",
    //   rating: 37,
    //   review: "Pretty solid as a fruit.",
    // });
    // await fruit.save();

    const personSchema = new mongoose.Schema({
      name: String,
      age: Number,
      favouriteFruit: fruitSchema,
    });

    const Person = mongoose.model("Person", personSchema);
    const person = new Person({
      name: "John",
      age: 37,
    });
    await person.save();

    //insertMany()
    // const kiwi = new Fruit({
    //   name: "Kiwi",
    //   rating: 10,
    //   review: "Best fruit.",
    // });

    // const orange = new Fruit({
    //   name: "Orange",
    //   rating: 8,
    //   review: "Ok fruit.",
    // });

    // await Fruit.insertMany([kiwi, orange])
    //   .then(() =>
    //     console.log(
    //       `Succesful insert ${
    //         [kiwi, orange].length
    //       } fruits in fruits collection`
    //     )
    //   )
    //   .catch(function (err) {
    //     console.log(err);
    //   });

    // const fruits = await Fruit.find();
    // console.log(fruits);
    // fruits.forEach((fruit) => console.log(fruit.name));

    //DEBUG: for validation
    // const fruit = new Fruit({
    //   // name: "Peach",
    //   rating: 10,
    //   review: "Pretty solid as a fruit.",
    // });
    // await fruit.save();

    //DEBUG: Update (using our Model)
    // await Fruit.updateOne(
    //   { _id: "64fa41ca4f274e4808e127e5" },
    //   { name: "Peach", review: "Super Juicy!" }
    // )
    //   .then((res) => console.log(`${res.modifiedCount} document was updated`))
    //   .catch(function (err) {
    //     console.log(err);
    //   });

    //DEBUG: Delete (using our Model)
    // await Fruit.deleteOne({ _id: "64fa473eebd2236c4ac0b5ec" })
    //   .then((res) => console.log(`${res.deletedCount} document(s) deleted`))
    //   .catch(function (err) {
    //     console.log(err);
    //   });

    //Delete Many
    // await Person.deleteMany({name: "John"});

    const pineapple = new Fruit({
      name: "Pineapple",
      rating: 9,
      review: "Amazing juicy and acidic fruit.",
    });
    await pineapple.save()

    // const person = new Person({
    //   name: "Amy",
    //   age: 12,
    //   favouriteFruit: pineapple,
    // });
    // await person.save();

    const mango = new Fruit({
      name: "Mango",
      rating: 3,
      review: "Decent and sweet fruit.",
    });
  } finally {
    // await mongoose.disconnect();
    mongoose.connection.close();
  }
}

main().catch(console.dir);
