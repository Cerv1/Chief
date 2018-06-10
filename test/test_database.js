var request = require('supertest'),
   app = require('../app.js'),
   mongoose = require('mongoose'),
   User = mongoose.model("User"),
   Incident = mongoose.model("Incident"),
   agent = request.agent(app);

   
describe('- Users tests', function () {
   it('Should register user', function (done) {
      user = new User({
         username: "Username",
         password: "Password",
         email: "email@user.com",
         firstName: "First",
         lastName: "Last Name"
      });
      user.save(done);
   });

   it('Should redirect to /home', function (done) {
      agent
         .post('/login')
         .field('username', 'Username')
         .field('password', 'Password')
         .expect('Location', '/home')
         .end(done)
   });

   it('Should delete user', function (done) {
      User.remove({ username: "Username", password: "Password" }).exec();
      return done();
   });
});

describe('- Incidents tests', function () {
   it('Should create incident', function (done) {
      incident = new Incident({
         number_id: 0,
         date: "Date",
         time: "Time",
         dep: "Dep",
         cen: 0,
         ppll: 0,
         issue: "Issue",
         operation: "Operation"
      });
      incident.save(done);
   });

   it('Should delete incident', function (done) {
      Incident.remove({
         issue: "Issue",
         cen: 0,
         time: "Time"
      })
         .exec();
      return done();
   });
});