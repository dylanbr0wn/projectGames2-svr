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

app.get('/artworks', (req, res) => {
    instance.get('artworks/', {
        data: `fields image_id; 
               where id = (${req.query.artworks.join(',')});`
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/cover', (req, res) => {
    instance.get('covers/', {
        data: `fields image_id; 
               where id = ${req.query.cover};`
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/games', (req, res) => {
    instance.get('games/', {
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

app.get('/gameDetails', (req,res) => {
    let query = `fields *; 
                 where id = ${req.query.id};`
    instance.get('games/', {
        data: query
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/gameCompanies', (req, res) => {
    let query = `fields *; 
                 where id = (${req.query.companyList.join(',')});`

    instance.get('involved_companies/', {
        data: query
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/companyNames', (req, res) => {
    let query = `fields name; 
                 where id = (${req.query.companyNames.join(',')});`

    instance.get('companies/', {
        data: query
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/relatedGames', (req, res) => {
    let query = `fields name,popularity,release_dates.human,cover,involved_companies,aggregated_rating,summary,genres; 
               where id = (${req.query.gameList.join(',')}); 
               sort popularity desc;`

    instance.get('games/', {
        data: query
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/getPlatforms', (req, res) => {
    let query = `fields *; 
               where id = (${req.query.platforms.join(',')});`

    instance.get('platforms/', {
        data: query
    }).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/ageRatings', (req, res) => {
    let query = `fields *; 
               where id = (${req.query.ratings.join(',')});`
    console.log(query)

    instance.get('age_ratings/', {
        data: query
    }).then(function (response) {
        if ("content_descriptions" in response.data[0]) {
            let query2 = `fields *; 
               where id = (${response.data[0].content_descriptions.join(',')});`
            console.log(query2)
            instance.get('/age_rating_content_descriptions', {
                data: query2
            }).then(function (response2) {
                console.log("here")
                response.data[0].content_descriptions = response2.data;
                res.send(response.data)
            })

        } else {
            res.send(response.data)
        }


    }).catch(function (error) {
        console.log(error);
    });
})

app.get('/', (req, res) => {
    res.send("hello");
});

app.listen(process.env.PORT || 3000)