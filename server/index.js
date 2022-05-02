const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')

// dependency uses
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
            if (result.length < 0) res.send({message: "This email is already in use."})
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
            else 
                // send the result if user was found, otherwise send an error message
                result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

app.get("/getAllMovies", (req, res) => {
    const errorMsg = "Could not read movies from database."
    db.query(
        "SELECT * FROM movie",
        (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

app.get("/getAllShows", (req, res) => {
    const errorMsg = "Could not read shows from database."
    db.query(
        "SELECT * FROM `show`",
        (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

app.post("/getShow", (req, res) => {
    const id = req.body.id

    const errorMsg = "Could not read show from database."
    db.query(
        "SELECT * FROM `show` WHERE show_id = ?", [id],
        (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

app.post("/getShows", (req, res) => {
    const id = req.body.id

    const errorMsg = "Could not read show from database."

    let query = "SELECT * FROM `show` WHERE show_id = ?"

    for (let i = 1; i < id.length; i++) {
        query += " OR show_id = ?"
    }

    console.log(query, id)

    db.query(
        query, id,
        (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})


app.post("/getMovie", (req, res) => {
    const id = req.body.id

    const errorMsg = "Could not read movie from database."
    db.query(
        "SELECT * FROM movie WHERE movie_id = ?", [id],
        (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

// get the details of a movie OR show depending on the 'type' received from the frontend based on id
app.post("/getDetails", (req, res) => {
    const id = req.body.id
    const type = req.body.type
    const errorMsg = "Could not get details from database."
    const query = type === 'movie' 
        ? "SELECT * FROM movie WHERE movie_id = ?" : "SELECT * FROM `show` WHERE show_id = ?"

    db.query(
        query, [id], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

// select all of the actors/ess of a show or movie
app.post("/getActors", (req, res) => {
    const id = req.body.id
    const type = req.body.type
    const errorMsg = "Could not get details from database."

    const selectMovieActor = "SELECT * FROM actor WHERE actor_id = " +
        "ANY (SELECT actor FROM movie_actor WHERE movie = ?)"
    const selectShowActor = "SELECT * FROM actor WHERE actor_id = " +
    "ANY (SELECT actor FROM show_actor WHERE `show` = ?)"
    const query = type === 'movie' ? selectMovieActor : selectShowActor

    db.query(
        query, [id], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

// insert a new review on a movie/show
app.post("/review", (req, res) => {
    const type = req.body.type
    const email = req.body.email
    const description = req.body.description
    const rating = req.body.rating
    const author = req.body.author
    const id = req.body.id

    const datetime = new Date().toLocaleString()

    let data = [rating, description, author, email, null, null, datetime]
    type === 'movie' ? data[4] = id : data[5] = id // set the movie/show id depending on type

    db.query(
        "INSERT INTO review (rating, description, author, email, movie_id, show_id, date) " + 
        "VALUES (?, ?, ?, ?, ?, ?, ?)", data,  (err, result) => {
            console.log(err)
            if (result.length < 0) res.send({message: "Could not submit review."})
            else res.send(result)
        }
    )
})

// get all reviews of the currently selected movie or show
app.post("/getReviews", (req, res) => {
    const id = req.body.id
    const type = req.body.type
    const errorMsg = "Could not get reviews from database."

    const query = type === 'movie' ? "SELECT * from review WHERE movie_id = ?" : 
        "SELECT * from review WHERE show_id = ?"
    
    db.query(
        query, [id], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

// update the current user's review
app.post("/editReview", (req, res) => {
    const email = req.body.email
    const desc = req.body.description
    const rating = req.body.rating
    const id = req.body.id 
    const type = req.body.type

    const query = type === 'movie' ? "UPDATE review SET description = ?, rating = ? WHERE email = ? AND movie_id = ?" :
        "UPDATE review SET description = ?, rating = ? WHERE email = ? AND show_id = ?"

    db.query(
        query, [desc, rating, email, id], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: err})
        }
    )
})

// delete a user's review based on their email
app.post("/deleteReview", (req, res) => {
    const email = req.body.email
    const type = req.body.type
    const id = req.body.id

    const query = type === 'movie' ? "DELETE FROM review WHERE email = ? AND movie_id = ?" : 
        "DELETE FROM review WHERE email = ? AND show_id = ?"

    db.query(
        query, [email, id], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: err})
        }
    )
})

// gets the current user's collection
app.post("/getCollection", (req, res) => {
    const email = req.body.email

    db.query(
        "SELECT * FROM collection WHERE email = ?",
        [email], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: errorMsg})
        }
    )
})

// adds a show or movie to the current user's collection
app.post("/addToCollection", (req, res) => {
    const email = req.body.email
    const type = req.body.type
    const id = req.body.id

    let data = [email, false, null, null]
    type === 'movie' ? data[3] = id : data[2] = id // set the movie/show id depending on type

    db.query(
        "INSERT INTO collection (email, isWatched, show_id, movie_id) " + 
        "VALUES (?, ?, ?, ?)", data,  (err, result) => {
            if (result.length < 0) res.send({message: "Could not submit review."})
            else res.send(result)
        }
    )
})

app.post("/deleteFromCollection", (req, res) => {
    const email = req.body.email
    const type = req.body.type
    const id = req.body.id

    const query = type === 'movie' ? "DELETE FROM collection WHERE email = ? AND movie_id = ?" : 
        "DELETE FROM collection WHERE email = ? AND show_id = ?"

    db.query(
        query, [email, id], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: err})
        }
    )
})

app.post("/getWatched", (req, res) => {
    const email = req.body.email

    db.query(
        "SELECT * FROM collection WHERE email = ? AND isWatched = 1",
        [email], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: "Error"})
        }
    )
})

app.post("/getNotWatched", (req, res) => {
    const email = req.body.email

    db.query(
        "SELECT * FROM collection WHERE email = ? AND isWatched = 0",
        [email], (err, result) => {
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: "Error"})
        }
    )
})

app.post("/toggleCollectionStatus", (req, res) => {
    const id = req.body.id
    const status = req.body.status

    const query = "UPDATE collection SET isWatched = ? WHERE id = ?"
    
    db.query(
        query, [!status, id], (err, result) => {
            console.log(result)
            if (err) res.send({error: err})
            else result.length > 0 ? res.send(result) : res.send({message: err})
        }
    )
})


PORT = 3001
app.listen(PORT, () => {
    console.log("Starting server on port", PORT)
})