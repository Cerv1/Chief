var express = require('express');

var app = express();

app.set('port', 8080);

app.use(express.static(__dirname + '/public'));

// serving an example html
app.get('/', function(request, response) {
  response.sendFile('index.html', {root: __dirname })
});

if (!module.parent) {
    app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'));
    });
  }
  module.exports = app;