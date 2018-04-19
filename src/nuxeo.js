var Nuxeo = require('nuxeo');

// create the Nuxeo client
var nuxeo = new Nuxeo({
    auth: {
      method: 'basic',
      username: 'Administrator',
      password: 'Administrator'
    }
});

nuxeo.connect()
  .then(function(client){
    // client.connected === true
    // client === nuxeo
    console.log('Connected OK!');
  })
  .catch(function(error) {
    // wrong credentials / auth method / ...
    throw error;
});