const express = require("express");
const path = require("path");
const LegoData = require("./modules/legoSets"); // may need to adjust path

const app = express();
const legoData = new LegoData();

// Serve static files from /public
app.use(express.static(path.join(__dirname, "..", "public")));

// HTML pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "views/home.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "..", "views/about.html")));

// API routes
app.get("/lego/sets", async (req, res) => { /* your existing handler */ });
app.get("/lego/sets/:set_num", async (req, res) => { /* ... */ });
app.get("/lego/add-test", async (req, res) => { /* ... */ });

// 404 fallback
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "..", "views/404.html")));

module.exports = app;
