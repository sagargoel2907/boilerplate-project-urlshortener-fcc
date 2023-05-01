require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// let insert=require('./database');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlPattern = /https:\/\/[a-z\-]{1,}\.[a-z]{1,}/;
app.post('/api/shorturl', async (req, res) => {
  let longUrl = req.body.url;
  console.log(longUrl);
  if (urlPattern.test(longUrl) == false) {
    return res.json({ error: 'invalid url' });
  }

  let shortUrl = await findShortUrl(longUrl);
  console.log(shortUrl);
  return res.json({ original_url: longUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:shortUrl', async (req, res) => {
  console.log(req.params.shortUrl);
  let longUrl = await findLongUrl(req.params.shortUrl);
  if (!longUrl) {
    console.log('does not exist')
    return res.redirect('https://boilerplate-project-urlshortener.sagargoel.repl.co');
  }
  console.log('redirecting to ', longUrl);
  res.redirect(longUrl);
  c
});

async function findShortUrl(longUrl) {
  let shortUrl = '';
  await Url.findOne({ longUrl }).then(async (url) => {
    if (url) {
      shortUrl = url.shortUrl;
      return;
    }
    shortUrl = await getUrlCount() + 1;
  });
  let url = Url({ longUrl, shortUrl });
  await url.save();
  return shortUrl;
}

async function findLongUrl(shortUrl) {
  let longUrl = '';
  await Url.findOne({ shortUrl }).then((url) => {
    if (!url) {
      longUrl = '';
      return;
    }
    console.log(url);
    longUrl = url.longUrl;
  });
  console.log("found longurl", longUrl);
  return longUrl;
}


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  shortUrl: Number,
  longUrl: String,
});

let Url = new mongoose.model('Url', urlSchema);

// let url = Url({ shortUrl: await getUrlCount()+1, longUrl: 'google.com' });
// url.save().then((data) => console.log(data));

async function getUrlCount() {
  let c;
  await Url.find({}).then((data) => {
    c = data.length;
  });
  return c;
}


