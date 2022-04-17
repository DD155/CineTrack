const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')

// dependecy uses
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: "project2"
})

// establish connection
db.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

// API call for registering a user
app.post("/register", (req, res) => {
    const email = req.body.email
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const password = req.body.password

    db.query(
        "INSERT INTO user (email, first_name, last_name, password) " + 
        "VALUES (?, ?, ?, ?)", [email, first_name, last_name, password], 
        (err, result) => {
            if (err) res.send({message: "This email is already in use."})
            else res.send(result)
        }
    )
})

// API call for logging in a user (check if user/password exists from input)
app.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const errorMsg = "Incorrect email or password."

    db.query(
        "SELECT * FROM user WHERE email = ? AND password = ?",
        [email, password], (err, result) => {
            if (err) res.send({error: err})

            // send the result if user was found, otherwise send an error message
            result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})


PORT = 3001
app.listen(PORT, () => {
    console.log("Starting server on port", PORT)
})