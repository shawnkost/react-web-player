const express = require("express");
const cors = require('cors');
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());

app.use(express.json());

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "58c63d6c452940378c16d1e4a5a65ee0",
    clientSecret: "33463e67ddd9490c9c62042eea3e94a0",
    refreshToken,
  })

spotifyApi.refreshAccessToken().then(
  (data) => {
    res.json({
      accessToken: data.body.accessToken,
      expiresIn: data.body.expiresIn
    })
  }).catch(() => {
    res.sendStatus(400);
  })
})

app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "58c63d6c452940378c16d1e4a5a65ee0",
    clientSecret: "33463e67ddd9490c9c62042eea3e94a0",
  });

  spotifyApi.authorizationCodeGrant(code).then(data => {
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    })
  }).catch(() => {
    res.sendStatus(400)
  })
})

app.get('/lyrics', async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found"
  console.log("lyrics", lyrics);
  res.json(lyrics);
})

app.listen(3001, () => console.log("Express listening on port 3001"))
