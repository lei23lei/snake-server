const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid directly
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Use dynamic import for lowdb
let low;
import('lowdb').then(lowdb => {
    low = lowdb.default; // Assign the default export of lowdb
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('db.json');
    const db = low(adapter);
    
    // Set up database defaults
    db.defaults({ users: [] }).write();
    
    // Route to serve the index.html file
    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
    });

    // Route to add a user
    app.post("/addUser", (req, res) => {
        const { name, score } = req.body;
        const id = uuidv4(); // Using uuid directly here
        db.get("users").push({ id, name, score }).write();
        res.json({ message: "User added successfully" });
    });

    // Route to send user data
    app.post("/sendUser", (req, res) => {
        let data = db.get("users").value();
        res.json(data); // Send user data as JSON response
    });

    // Start the server
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch(error => {
    console.error('Error loading lowdb:', error);
});
