require("dotenv").config();

const path = require("path");
const express = require("express");
const app = express();

const needle = require("needle");
const TOKEN = process.env.TWITTER_BEARER_TOKEN;

const baseUrl = "https://api.twitter.com/1.1/users/show.json?screen_name=";
// const baseUrl = "https://api.twitter.com/2/users/by/username/";

const PORT = process.env.PORT || 8000;

app.use(express.static(path.resolve(__dirname, "../client")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api/v1/getuser/:userhandle", (req, res, next) => {
  try {
    getUser(req, res, next);
  } catch (error) {
    res.json({error});
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "index.html"));
});

async function getUser(req, res, next) {
  const userFields = "user.fields=description,created_at,location,profile_image_url,public_metrics"; // required fields
  const endpointUrl = `${baseUrl}${req.params.userhandle}?${userFields}`;

  const response = await needle("get", `${baseUrl}${req.params.userhandle}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  console.log(response.body);

  const {
    name,
    screen_name,
    location,
    description,
    followers_count,
    friends_count,
    profile_image_url_https,
    profile_banner_url,
    url
  } = response.body;
  
  res.json({
    name,
    screen_name,
    location,
    description,
    followers_count,
    friends_count,
    profile_image_url_https,
    profile_banner_url,
    url
  });
}

app.listen(PORT, () => {
  console.log(`Server started: Listening on port ${PORT}`);
});