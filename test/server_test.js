var request = require('supertest'),
    app = require('../app.js');

describe('- Server tests', function() {

  // testing the correct status of the API
  it('Should create server', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200, done);
  });

});