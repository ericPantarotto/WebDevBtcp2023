// var generateName = require("sillyname");
import generateName from "sillyname";
import superheroes from "superheroes";

var sillyName = generateName();
console.log(`My name is ${sillyName}`);

var superHero = superheroes.random();
console.log(`I am superhero: ${superHero}`);
