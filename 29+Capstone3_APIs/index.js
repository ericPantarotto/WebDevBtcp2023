import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import * as fs from "fs";

const app = express();
const port = 3000;
const API_URL = "https://api.currencyapi.com/v3/latest";
const yourAPIKey = JSON.parse(fs.readFileSync("./secret.txt")).apikey;

const currFile = JSON.parse(fs.readFileSync("./currencies.txt"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  try {
    let baseCurrencyReq = req.body.base_currency.trim();
    let currenciesReq = req.body.currencies.replaceAll(" ", "");
    const response = await axios.get(API_URL, {
      params: {
        base_currency: baseCurrencyReq,
        currencies: currenciesReq,
        apikey: yourAPIKey,
      },
    });

    let dataArray = [];
    currenciesReq.split(",").forEach((el) => {
      // dataArray.push(currFile.data[el]);
      dataArray.push(response.data.data[el]);
    });

    res.render("index.ejs", { data: dataArray });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      content: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
