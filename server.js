'use strict';

const url = "postgres://esam:12345@localhost:5432/movies";
const bodyParser = require('body-parser');
const { Client } = require('pg')
const client = new Client(url)
const express = require('express');
// const moviesData = require("./Movie Data/data.json");
const cors = require("cors");
const axios = require('axios').default;
require('dotenv').config()
const apiKey = process.env.API_KEY;
const PORT = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post("/addMovie", handleAdd);
app.get("/getMovies", handleGet);
app.use(handleError);
 
function handleAdd(req, res) {
    const { name, time, summary, image } = req.body;

    let sql = 'INSERT INTO movie(name,time,summary,image ) VALUES($1, $2, $3, $4) RETURNING *;'
    let values = [name, time, summary, image];
    client.query(sql, values).then((result) => {
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);


    }).catch((err) => {
        handleError(err, req, res);
    });
}

function handleGet(req, res) {
    let sql = 'SELECT * from movie;'
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    });
}

function handleError(error, req, res) {
    res.status(500).send(error);
}
// app.get("/", handleHomePage);
// app.get('/favorite', handleFavorite);
// app.get('/trending', handleTrending);
// app.get("/search", handleSearch);
// function handleHomePage(req, res) {
//     let result = [];
//     let newMovies = new Movie(moviesData.title, moviesData.poster_path, moviesData.overview);
//     result.push(newMovies);
//     res.json(result);
// }
// function handleFavorite(req, res) {
//     res.send('Welcome to Favorite Page');
// }
// function handleTrending(req, res) {
//     const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
//     axios.get(url)
//         .then(result => {
//             // console.log(result.data.results);

//             let trendings = result.data.results.map(trending => {
//                 return new Trend(trending.id, trending.title, trending.release_date, trending.poster_path, trending.overview);
//             })
//             res.json(trendings);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.send("Inside catch")
//         })
// }
// function handleSearch(req, res) {
//     console.log(req.query);
//     let movieName = req.query.movieName; // 
//     let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`
//     axios.get(url)
//         .then(result => {
//             console.log(result.data.results);
//             res.json(result.data.results)
//         })
//         .catch((error) => {
//             console.log(error);
//             res.send("Searching for movies")
//         })
// }
// app.get('/error', (req, res) => res.send(error()));
// app.use(function (err, req, res, text) {
//     console.log(err.stack);
//     res.type('text/plain');
//     res.status(500);
//     res.send({
//         "status": 500,
//         "responseText": "Sorry, something went wrong"
//     });
// })
// app.use(function (req, res, text) {
//     res.status(404);
//     res.type('text/plain');
//     res.send({
//         "status": 404,
//         "responseText": "page not found"
//     });
// })

// function Movie(title, poster_path, overview) {
//     this.title = title;
//     this.poster_path = poster_path;
//     this.overview = overview;
// }
// function Trend(id, title, release_date, poster_path, overview) {
//     this.id = id;
//     this.title = title;
//     this.release_date = release_date;
//     this.poster_path = poster_path;
//     this.overview = overview;
// }
client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    })
})