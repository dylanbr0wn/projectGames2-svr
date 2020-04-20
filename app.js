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


app.get('/listCover', (req, res) => {
    instance.get('covers/', {
        data: `fields image_id; 
               where id = (${req.query.coverList.join(',')});`
    }).then(function (response) {

        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/games', (req, res) => {
    instance.get('games/',{
        data: `fields name,popularity,release_dates.human,cover,involved_companies,aggregated_rating,summary,genres; 
               where version_parent = null & summary != null; 
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
    let query = `search "${req.query.search}"; 
                 fields name,release_dates.human,cover,involved_companies,aggregated_rating,summary,genres;
                 limit ${req.query.itemsPerPage}; 
                 offset ${req.query.itemsPerPage * (req.query.page - 1)};`
    instance.get('games/',{
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