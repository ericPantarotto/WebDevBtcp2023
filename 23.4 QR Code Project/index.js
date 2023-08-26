/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
/*
NOTE:
https://www.npmjs.com/package/inquirer
https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/examples/pizza.js
*/
import findRemoveSync from "find-remove";
import * as fs from "fs";
import inquirer from "inquirer";
import qr from "qr-image";

// console.log(process.cwd());
const result = findRemoveSync(
  "./23.4 QR Code Project",
  { extensions: [".png"] }
);
console.log(result);

const questions = [
  {
    type: "input",
    name: "url",
    message: "Please provide an URL...",
    default: "www.google.com",
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    // console.log(JSON.stringify(answers, null, "  "));
    const urlText = answers["url"];

    const matches = urlText.match(/\.(.*?)\./g);
    let match = matches[0];
    match = match.substring(1, match.length - 1);

    // if (matches) {
    //   for (let i = 0; i < matches.length; ++i) {
    //     const match = matches[i];
    //     const substring = match.substring(1, match.length - 1); // brackets removing
    //     console.log(substring);
    //   }
    // }

    var qr_svg = qr.image(urlText, { type: "png" });
    qr_svg.pipe(fs.createWriteStream(`${match}.png`));

    fs.writeFile("./" + match + ".txt", urlText, (err) => {
      if (err) throw err;
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
      console.log(error);
    }
  });
