/**
 * Created by Mo on 3/11/2016.
 */
var http = require('http'), fs = require('fs');

function handle_incoming_request (req, res) {
    console.log('Incoming request: (' + req.method + ') ' + req.url);

    if (req.url == '/images.json') {
        handle_load_images(req, res);
    } else if (req.url.substr(0, 7) == '/images'
            && req.url.substr(req.url.length - 5) == '.json') {
        handle_get_album(req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'unknown resource'}));
    }
}


function handle_get_album(req, res) {
    var album_name = req.url.substr(7, req.url.length - 12);

    load_album(album_name, function (err, images) {
        if (err != null) {
            res.writeHead(503 ,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'file_error', message: err.message}) + '\n');
            return;
        }
        res.writeHead(200 ,{'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: null, data: {album_name: album_name, images: images}}) + '\n');
    });
}


function load_album (album_name, callback) {
    fs.readdir('images/' + album_name, function (err, file_list) {
        if(err) {
            callback(err);
            return;
        }

        var files_only = [];
        (function iterator(i){
            if (i >= file_list.length) {
                callback(null, files_only);
                return;
            }
            fs.stat('images/' + album_name + '/' + file_list[i], function (err, stats) {
                if (err) {
                    callback(err);
                    return;
                }
                if (stats.isFile())
                    files_only.push(file_list[i]);
                iterator(i + 1);
            });
        })(0);
    });
}

function handle_load_images (req, res) {
    load_image_list( function (err, images) {
        if (err != null) {
            res.writeHead(503 ,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'file_error', message: err.message}) + '\n');
            return;
        }
        res.writeHead(200 ,{'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: null, data: {images: images}}) + '\n');
    });
}

function load_image_list (callback) {
    fs.readdir('images/', function (err, file_list) {
        if(err) {
            callback(err);
            return;
        }

        var dirs_only = [];
        (function iterator(i){
            if (i >= file_list.length) {
                callback(null, dirs_only);
                return;
            }
            fs.stat('images/' + file_list[i], function (err, stats) {
                if (err) {
                    callback(err);
                    return;
                }
                if (stats.isDirectory())
                    dirs_only.push(file_list[i]);
                iterator(i + 1);
            });
        })(0);
    });
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);