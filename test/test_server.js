var request = require('supertest'),
    app = require('../app.js'),
    agent = request.agent(app);

describe('- Server tests', function () {
  it('Should create web server', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200, done);
  });

  it('Should get sign up page', function (done) {
    request(app)
      .get('/signup')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200, done);
  });

  it('Should get sign out page', function (done) {
    request(app)
      .get('/signout')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });

  it('Should not get /home page', function (done) {
    request(app)
      .get('/home')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });

  it('Should not get /home_incident page', function (done) {
    request(app)
      .get('/home_incident')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_incident page', function (done) {
    request(app)
      .get('/fill_incident')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_new_turn page', function (done) {
    request(app)
      .get('/fill_new_turn')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_end_turn page', function (done) {
    request(app)
      .get('/fill_end_turn')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /home_ordinance page', function (done) {
    request(app)
      .get('/home_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /home_noise_ordinance page', function (done) {
    request(app)
      .get('/home_noise_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_clean_ordinance page', function (done) {
    request(app)
      .get('/fill_clean_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_botellon_ordinance page', function (done) {
    request(app)
      .get('/fill_botellon_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_noise_residency_ordinance page', function (done) {
    request(app)
      .get('/fill_noise_residency_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_noise_establishment_ordinance page', function (done) {
    request(app)
      .get('/fill_noise_establishment_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_noise_measurement_ordinance page', function (done) {
    request(app)
      .get('/fill_noise_measurement_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /home_work_waste_ordinance page', function (done) {
    request(app)
      .get('/home_work_waste_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_building_inspection_ordinance page', function (done) {
    request(app)
      .get('/fill_building_inspection_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_waste_ordinance page', function (done) {
    request(app)
      .get('/fill_waste_ordinance')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /home_accidents page', function (done) {
    request(app)
      .get('/home_accidents')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_accident_2_vehicle page', function (done) {
    request(app)
      .get('/fill_accident_2_vehicle')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });

  it('Should not get /fill_accident_3_vehicle page', function (done) {
    request(app)
      .get('/fill_accident_3_vehicle')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /home_sketch page', function (done) {
    request(app)
      .get('/home_sketch')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
  it('Should not get /fill_send_sketch page', function (done) {
    request(app)
      .get('/fill_send_sketch')
      .expect('Content-Type', "text/plain; charset=utf-8")
      .expect(302, done);
  });
});