const express = require("express");
const bodyParser = require("body-parser");
const { print } = require("pdf-to-printer");
const fs = require("fs");
const cors = require("cors");   // <-- add this

const app = express();
app.use(bodyParser.json());

// allow all origins (for testing)
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// Your print route
app.post("/print", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).send({ error: "No text provided" });

    const filePath = "./print.txt";
    fs.writeFileSync(filePath, text);

    try {
        await print(filePath, { printer: "TM-P20II_000686" });
        console.log("PRINTING SUCCESSFULLY !!")
        res.send({ status: "success" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "error", message: err.message });
    }
});

app.listen(3001, () => console.log("Print bridge running on port 3001"));
