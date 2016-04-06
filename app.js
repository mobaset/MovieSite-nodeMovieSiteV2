/**
 * Created by Mo on 3/11/2016.
 */
var express = require('express'), fs = require('fs');
var app = express();
var port = process.env.PORT || 8080; // a variable that stores a dynamic port
const http = require('http');
var apiKey = "api_key= f88a673179c88a480ebd3bfd5b852a57";

// a middleware to grab CSS and JS files
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
app.listen(port);

// object to receive data from the movies site API

var request = require('request');
var destination = fs.createWriteStream('./Public/data/moviesdb.json');

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
//
//
//
//
// //added by Weam
// app.get('/actsearch', function (req, res) {
//     var param = "";
//     if (req.query.p) {
//         param = 'http://api.themoviedb.org/3/search/person?'+apiKey+'&query='+req.query.q+'&page='+req.query.p;
//     }
//     else {
//         param = 'http://api.themoviedb.org/3/search/person?'+apiKey+'&query='+req.query.q;
//     }
//     request.get({url: param,headers: {'Accept':'application/json'}}).pipe(res); //send request to backend service and pipe the response to the client
// });
//
// app.get('/actid', function (req, res) {
//     var param = "http://api.themoviedb.org/3/person/"+req.query.q+"?"+apiKey;
//     request.get({url: param,headers: {'Accept':'application/json'}}).pipe(res);
// });
//
// app.get('/actmovies', function (req, res) {
//     var param = "http://api.themoviedb.org/3/person/"+req.query.q+"/movie_credits?"+apiKey;
//     request.get({url: param,headers: {'Accept':'application/json'}}).pipe(res);
// });