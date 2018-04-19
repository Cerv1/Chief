import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
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

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
