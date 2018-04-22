var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var dbConfig = require('./app/db.js');

var app = express();

app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(dbConfig.url, function (err) {
    if (err) console.log("Cannot connect to mongodb");
});


app.set('port', 4000);

app.use(express.static(__dirname + '/public'));

// serving an example html
app.get('/', function (request, response) {
    response.sendFile('index.html', { root: __dirname })
});



if (!module.parent) {
    app.listen(app.get('port'), function () {
        console.log("Node app is running at localhost:" + app.get('port'));
    });
}
module.exports = app;