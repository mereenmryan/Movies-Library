'use strict';
const express = require('express');
const moviesData = require("./Movie Data/data.json");
const app = express();
const port = 3000
app.get("/", handleHomePage)
function handleHomePage(req, res) {
    let result = [];
    let newMovies = new Movie(moviesData.title, moviesData.poster_path, moviesData.overview);
    result.push(newMovies)
    res.json(result);
}
app.get('/favorite', handleFavorite);

function handleFavorite(req, res) {
    res.send('Welcome to Favorite Page');
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
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}