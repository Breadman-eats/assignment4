/********************************************************************************
*  WEB700 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Matthaus Matthew Student ID: 137314233 Date: 2025-06-14
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/



// Step 1 - Importing required modules
const LegoData = require("./modules/LegoSets");
const legoData = new LegoData();

const express = require("express");
const path = require("path");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from the /public
app.use(express.static(__dirname + '/public'));


// Serve static HTML pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Lego Sets route with optional ?theme query
app.get("/Lego/Sets", async (req, res) => {
    try {
        if (req.query.theme) {
            const result = await legoData.getSetsByTheme(req.query.theme);
            res.json(result);
        } else {
            const result = await legoData.getAllSets();
            res.json(result);
        }
    } catch (err) {
        res.status(404).send(err);
    }
});

// Specific Lego Set route
app.get("/Lego/Sets/:set_num", async (req, res) => {
    try {
        const result = await legoData.getSetByNum(req.params.set_num);
        res.json(result);
    } catch (err) {
        res.status(404).send(err);
    }
});

// Step 6 - Adding a test route to add a Lego set
app.get("/lego/add-test", async (req, res) => {
    let testSet = {
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

// 404 Route
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Initialize and Start Server
legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });


