var express = require('express');
var Incident = require('../models/incident');
const fs = require('fs');
const carbone = require('carbone');

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
	"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];


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
		res.render('fill_incident', { user: req.user });
	});

	router.get('/fill_new_turn', isAuthenticated, function (req, res) {
		res.render('fill_new_turn', { user: req.user });
	});
	

	router.post('/new_incident', isAuthenticated, function(req, res){
		var newIncident = new Incident();
		newIncident.number_id = req.body.number_id;
		newIncident.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		newIncident.dep = req.body.dep;
		newIncident.cen = req.body.cen;
		newIncident.ppll = req.body.ppll;
		newIncident.issue = req.body.issue;
		newIncident.operation = req.body.operation;
		newIncident.save(function (err) {
			if (err) {
				console.log('Error in Saving Incident: ' + err);
				throw err;
			}
			console.log('Incident Saved Successfully');
		});

		console.log("Nuevo telefonema añadido");

		// carbone.render('/home/cervi/Escritorio/plantillas/telefonema_template.odt', data, function (err, result) {
		// 	if (err) {
		// 		return console.log(err);
		// 	}
		// 	// write the result
		// 	fs.writeFileSync('result.odt', result);
		// });
		res.redirect('home');
	});

	router.post('/new_turn', isAuthenticated, function(req, res){

		var new_turn_data = {
			'pl1' : req.body.pl1,
			'pl2' : req.body.pl2,
			'pl3' : req.body.pl3,
			'pl4' : req.body.pl4,
			'morning' : 'XX',
			'evening' : ' ',
			'night' : ' ',
			'timetable' : '7:00 a 15:00',
			'turn_chief' : req.body.turn_chief,
			'year' : new Date().getFullYear(),
			'month' : monthNames[new Date().getMonth()]
		};

		if(req.body.turns_radio == "evening"){
			new_turn_data.morning = ' ';
			new_turn_data.evening = 'XX';
			new_turn_data.timetable = '15:00 a 22:00';

		}
		else if (req.body.turns_radio == "night") {
			new_turn_data.morning = ' ';
			new_turn_data.night = 'XX';
			new_turn_data.timetable = '22:00 a 7:00';
		}

		console.log(new_turn_data);


		carbone.render('/home/cervi/Escritorio/plantillas/telefonema_template.odt', new_turn_data, function (err, result) {
			if (err) {
				return console.log(err);
			}
			// write the result
			fs.writeFileSync('result.odt', result);
		});
		res.redirect('home');
	});

	return router;
}





