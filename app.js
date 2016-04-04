/**
 * Created by Mo on 3/11/2016.
 */
var express = require('express'), fs = require('fs');
var app = express();
var port = process.env.PORT || 8080; // a variable that stores a dynamic port
const http = require('http');

// a middleware to grap CSS and JS files
app.use('/public', express.static(__dirname + '/Public'));

// the get method to open the homepage when the url is called.
app.get('/', function (req, res) {
    fs.createReadStream(__dirname + '/Views/HomePage.xhtml').pipe(res);
});

// a get method to load movie page
app.get('/MoviePage.xhtml', function (req, res) {
    fs.createReadStream(__dirname + '/Views/MoviePage.xhtml').pipe(res);
});

app.get('/MovieOverview.xhtml', function (req, res) {
    fs.createReadStream(__dirname + '/Views/MovieOverview.xhtml').pipe(res);
});

app.get('/Actors.xhtml', function (req, res) {
    fs.createReadStream(__dirname + '/Views/Actors.xhtml').pipe(res);
});


// object to receive data from the movies site API

var request = require('request');
var destination = fs.createWriteStream('./public/data/moviesdb.json');

//getting the data from the the moviedb website
//added by Elwaleed 20/03.2016
request({
    method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/550?api_key=f88a673179c88a480ebd3bfd5b852a57&append_to_response=releases,trailers',

    headers: {
        'Accept': 'application/json'
    }},function (error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers));
    console.log('Response:', body);
}).pipe(destination);
app.listen(port);

