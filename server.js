const express = require('express');
const low = require('lowdb');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid directly
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Set up database defaults (outside of route handlers)
db.defaults({ users: [] }).write();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/addUser", (req, res) => {
    const { name, score } = req.body;
    console.log('name:', name, 'score:', score);
    const id = uuidv4(); // Using uuid directly here
    db.get("users").push({ id, name, score }).write();
    res.json({ message: "User added successfully" });
});

app.post("/sendUser", (req, res) => {
    let data = db.get("users").value();
    console.log(data);
    res.json(data); // Send user data as JSON response
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
