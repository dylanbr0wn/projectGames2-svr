const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const compression = require('compression');


const instance = axios.create({
    baseURL: "https://api-v3.igdb.com/",
    headers: {
        'user-key': process.env.IGDB_KEY,
        'Content-Type': 'text/plain'
    },
})


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(compression())


app.get('/games', (req, res) => {
    instance.get('games/', {
        data: `fields name,popularity,cover.image_id,aggregated_rating,genres; 
               where version_parent = null; 
               sort popularity desc; 
               limit ${req.query.itemsPerPage}; 
               offset ${req.query.itemsPerPage * (req.query.page - 1)};`
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
  })

app.get('/search', (req, res) => {
    let query = `
                 fields name,popularity,cover.image_id,aggregated_rating,genres;
                 where name ~*"${req.query.search}"*;
                 sort popularity desc;
                 limit ${req.query.itemsPerPage}; 
                 offset ${req.query.itemsPerPage * (req.query.page - 1)};`
    console.log(query)
    instance.get('games/', {
        data: query
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/gameDetails', (req,res) => {
    let query = `fields age_ratings.*,age_ratings.content_descriptions.*,aggregated_rating,aggregated_rating_count,alternative_names.*,artworks.image_id,category,cover.image_id,external_games.*,game_engines.*,game_modes.*,genres.*,hypes,involved_companies.*,involved_companies.company.name,keywords.*,multiplayer_modes.*,name,platforms.name,popularity,rating,rating_count,release_dates.human,screenshots.image_id,similar_games.name,similar_games.cover.image_id,slug,status,storyline,summary,tags,themes.*,url,version_parent; 
                 where id = ${req.query.id};`
    instance.get('games/', {
        data: query
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/', (req, res) => {
    res.send("hello");
});

app.listen(process.env.PORT || 3000)