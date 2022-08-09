const port = 8000;
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config()

const app = express();
app.use(cors());
app.listen(port, () => console.log(`server is running at port ${port}`));

app.get("/word", (req, res) => {
  const options = {
    method: "GET",
    url: "https://random-words5.p.rapidapi.com/getMultipleRandom",
    params: { count: "5", wordLength: "5" },
    headers: {
      "X-RapidAPI-Key": process.env.RANDOM_WORD_KEY,
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data[0]);
      res.json(response.data[0]);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/check", (req, res) => {
  const word = req.query.word;

  const options = {
    method: "GET",
    url: "https://twinword-word-graph-dictionary.p.rapidapi.com/theme/",
    params: { entry: word },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_CHECK_KEY,
      "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data.result_msg);
    })
    .catch((error) => {
      console.error(error);
    });
});
