var express = require('express');
var Incident = require('../models/incident');

var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/incident', isAuthenticated, function (req, res) {
		res.render('incident', { user: req.user });
	});
	

	router.post('/new_incident', isAuthenticated, function(req, res){
		var newIncident = new Incident();
		newIncident.number_id = 1;
		newIncident.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		newIncident.dep = req.param('dep');
		newIncident.cen = req.param('cen');
		newIncident.ppll = req.param('ppll');
		newIncident.issue = req.param('issue');
		newIncident.operation = req.param('operation');
		newIncident.save(function (err) {
			if (err) {
				console.log('Error in Saving Incident: ' + err);
				throw err;
			}
			console.log('Incident Saved Successfully');
		});

		console.log("Nuevo telefonema añadido");
		res.redirect('home');
	});

	return router;
}





