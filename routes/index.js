var express = require('express');
var Incident = require('../models/incident');
var Doc = require('../doc_functions.js');


var doc = new Doc();
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

	router.get('/incident_home', isAuthenticated, function (req, res) {
		res.render('incident_home', { user: req.user });
	});

	router.get('/fill_incident', isAuthenticated, function (req, res) {
		// console.log(Incident.find({}));
		res.render('fill_incident', { user: req.user });
	});

	router.get('/fill_new_turn', isAuthenticated, function (req, res) {
		res.render('fill_new_turn', { user: req.user });
	});

	router.get('/fill_end_turn', isAuthenticated, function (req, res) {
		res.render('fill_end_turn', { user: req.user });
	});
	

	router.post('/new_incident', isAuthenticated, function(req, res){
		var date = new Date();
		var newIncident = new Incident();
		newIncident.number_id = req.body.number_id;
		newIncident.date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
		newIncident.time = (date.getUTCHours() + 2) + ':' + (date.getUTCMinutes());
		newIncident.dep = req.body.dep;
		newIncident.cen = req.body.cen;
		newIncident.ppll = req.body.ppll;
		newIncident.issue = req.body.issue;
		newIncident.operation = req.body.operation;

		// doc.writeNewIncident(newIncident);

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


	router.post('/new_turn', isAuthenticated, function(req, res){
		doc.writeBeginTurn(req.body);
		res.redirect('home');
	});

	router.post('/end_turn', function(req, res){
		doc.writeEndTurn();
		// res.redirect('home');
	});

	return router;
}





