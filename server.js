const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const { createRequire } = require('module');
const requireCommonJS = createRequire(import.meta.url);

const low = requireCommonJS('lowdb');
const FileSync = requireCommonJS('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

db.defaults({ users: [] }).write();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addUser", (req, res) => {
    const { name, score } = req.body;
    console.log('name:', name, 'score:', score);
    const id = uuidv4();
    db.get("users").push({ id, name, score }).write();
    res.json({ message: "User added successfully" });
});

app.post("/sendUser", (req, res) => {
    let data = db.get("users").value();
    console.log(data);
    res.json(data);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
