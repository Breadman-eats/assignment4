const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const LegoData = require("../modules/legoSets"); // ✅ fixed path

const app = express();
const legoData = new LegoData();

// Middleware for static files
app.use(express.static(__dirname + '/public'));

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "views/home.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "..", "views/about.html")));

app.get("/lego/sets", async (req, res) => {
  try {
    const data = req.query.theme
      ? await legoData.getSetsByTheme(req.query.theme)
      : await legoData.getAllSets();
    res.json(data);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.json(set);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/add-test", async (req, res) => {
  const testSet = {
    set_num: "123",
    name: "Test Set Name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  };

  try {
    await legoData.addSet(testSet);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(422).send(err);
  }
});

// 404 fallback
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "..", "views/404.html")));

// ✅ Vercel handler export
module.exports = app;
module.exports.handler = serverless(app);
