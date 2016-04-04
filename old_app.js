/**
 * Created by Mo on 3/11/2016.
 */
var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 8080;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type' : 'application/xhtml+xml'});
    fs.createReadStream(__dirname + '/Views/MoviePage.xhtml').pipe(res);

    //var html = fs.readFile(__dirname + '/views/MoviePage.xhtml');
    //res.end(html);
}).listen(port, function  () {
    console.log('Express server listening on %d', port);
});