'use strict';
require('dotenv').config()
const port = process.env.PORT;
const url = "postgres://esam:12345@localhost:5432/movies";
const bodyParser = require('body-parser');
const { Client } = require('pg')
// const client = new Client(url) //for running locally
const client = new Client({ //for running in heroku
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const express = require('express');
// const moviesData = require("./Movie Data/data.json");
const cors = require("cors");
const axios = require('axios').default;
const apiKey = process.env.API_KEY;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post("/addMovie", handleAdd);
app.get("/getMovies", handleGet);
// app.use(handleError);

app.put("/UPDATE/:id", handleUpdate);
app.delete("/DELETE/:id", handleDelete);
app.get("/getMoviesById/:id", handleGetById);



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
function handleUpdate(req, res) {
    const { name, time, summary, image } = req.body;
    const { id } = req.params;
    let sql = `UPDATE movie SET name=$1, time=$2, summary=$3, image=$4 WHERE id=$5 RETURNING *;`  
    console.log(sql);
    let values = [name, time, summary, image, id];
    client.query(sql, values).then((result) => {
      // console.log(result.rows);
      return res.status(200).json(result.rows);
    }).catch()
  }
  function handleDelete(req, res) {
    const  movieId  = req.params.id
    let sql = 'DELETE FROM movie WHERE id=$1;'
    let value = [movieId];
    client.query(sql, value).then(result => {
      console.log(result);
      res.send("deleted");
    }
    ).catch()
  }
  function handleGetById(req, res) {
    const { id } = req.params;
    let sql = 'SELECT * from movie WHERE id=$1;'
    // console.log(id);
    let value = [id];
    client.query(sql, value).then((result) => {
      res.json(result.rows);
    }).catch();
  }
app.get("/", handleHomePage);
app.get('/favorite', handleFavorite);
app.get('/trending', handleTrending);
app.get("/search", handleSearch);
function handleHomePage(req, res) {
    let result = [];
    let newMovies = new Movie(moviesData.title, moviesData.poster_path, moviesData.overview);
    result.push(newMovies);
    res.json(result);
}
function handleFavorite(req, res) {
    res.send('Welcome to Favorite Page');
}
function handleTrending(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            // console.log(result.data.results);

            let trendings = result.data.results.map(trending => {
                return new Trend(trending.id, trending.title, trending.release_date, trending.poster_path, trending.overview);
            })
            res.json(trendings);
        })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch")
        })
}
function handleSearch(req, res) {
    console.log(req.query);
    let movieName = req.query.movieName; // 
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`
    axios.get(url)
        .then(result => {
            console.log(result.data.results);
            res.json(result.data.results)
        })
        .catch((error) => {
            console.log(error);
            res.send("Searching for movies")
        })
}
app.get('/error', (req, res) => res.send(error()));
app.use(function (err, req, res, text) {
    console.log(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send({
        "status": 500,
        "responseText": "Sorry, something went wrong"
    });
})
app.use(function (req, res, text) {
    res.status(404);
    res.type('text/plain');
    res.send({
        "status": 404,
        "responseText": "page not found"
    });
})

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
function Trend(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
client.connect().then() => {

    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })}