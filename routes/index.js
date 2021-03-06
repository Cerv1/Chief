var express = require('express');
var Incident = require('../models/incident');
var Doc = require('../doc_functions.js');
const CONSTANTS = require('../constants.js')

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
		// console.log(req.flash('message'));
		res.render('home', { user: req.user, messages: req.flash('message') });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// ----------------------------------------------------------------------
	// -------------------------- INCIDENTS ROUTES --------------------------
	// ----------------------------------------------------------------------
	

	router.get('/home_incident', isAuthenticated, function (req, res) {
		res.render('home_incident', { user: req.user });
	});

	router.get('/fill_incident', isAuthenticated, function (req, res) {
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
		
		if ((date.getUTCHours()+2) < 10 ){
			newIncident.time = '0'+(date.getUTCHours() + 2) + ':' + (date.getUTCMinutes());
		}
		else{
			newIncident.time = (date.getUTCHours() + 2) + ':' + (date.getUTCMinutes());
		}

		newIncident.dep = req.body.dep;
		newIncident.cen = req.body.cen;
		newIncident.ppll = req.body.ppll;
		newIncident.issue = req.body.issue;
		newIncident.operation = req.body.operation;

		newIncident.save(function (err) {
			if (err) {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
			req.flash('message', '¡Incidente guardado correctamente!');
			res.redirect('home');
			
		});
	});


	router.post('/new_turn', isAuthenticated, function(req, res){
		doc.writeBeginTurn(req.body, function(ret){
			if(ret){
				req.flash('message', '¡Nuevo parte de servicio generado!');
				res.redirect('home');
			}
			else{
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})

	});


	router.post('/end_turn', function(req, res){
		for(key in req.body){
			if(req.body[key] == ''){
				req.body[key] = '0';
			}
		}
		doc.writeEndTurn(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nuevo documento de fin de servicio generado!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	// -----------------------------------------------------------------------
	// -------------------------- ORDINANCES ROUTES --------------------------
	// -----------------------------------------------------------------------

	router.get('/home_ordinance', isAuthenticated, function (req, res) {
		res.render('home_ordinance', { user: req.user });
	});

	router.get('/home_noise_ordinance', isAuthenticated, function (req, res) {
		res.render('home_noise_ordinance', { user: req.user });
	});


	router.get('/fill_clean_ordinance', isAuthenticated, function (req, res) {
		res.render('fill_clean_ordinance', { user: req.user });
	});

	router.post('/new_clean_ordinance', function (req, res) {
		doc.writeCleanOrdinance(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nueva ordenanza de limpieza generada!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	router.get('/fill_botellon_ordinance', isAuthenticated, function (req, res) {
		res.render('fill_botellon_ordinance', { user: req.user });
	});

	router.post('/new_botellon_ordinance', function (req, res) {
		doc.writeBotellonOrdinance(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nueva ordenanza de botellón generada!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	router.get('/fill_noise_residency_ordinance', isAuthenticated, function (req, res) {
		res.render('fill_noise_residency_ordinance', { user: req.user });
	});

	router.post('/new_noise_residency_ordinance', function (req, res) {
		doc.writeNoiseResidencyOrdinance(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nueva ordenanza de ruido en residencia generada!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	router.get('/fill_noise_establishment_ordinance', isAuthenticated, function (req, res) {
		res.render('fill_noise_establishment_ordinance', { user: req.user });
	});

	router.post('/new_noise_establishment_ordinance', function (req, res) {
		doc.writeNoiseEstablishmentOrdinance(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nueva ordenanza de ruido en establecimiento generada!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	}); 
	
	router.get('/fill_noise_measurement_ordinance', isAuthenticated, function (req, res) {
		res.render('fill_noise_measurement_ordinance', { user: req.user });
	});

	router.post('/new_noise_measurement_ordinance', function (req, res) {
		doc.writeNoiseMeasurementOrdinance(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nuevo acta de medición de ruido generada!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	router.get('/home_work_waste_ordinance', isAuthenticated, function (req, res) {
		res.render('home_work_waste_ordinance', { user: req.user });
	});

	router.get('/fill_building_inspection_ordinance', isAuthenticated, function (req, res) {
		res.render('fill_building_inspection_ordinance', { user: req.user });
	});

	router.post('/new_building_inspection_ordinance', function (req, res) {
		doc.writeBuildingInspectionOrdinance(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nuevo acta de inspección de obras generada!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	router.get('/fill_waste_ordinance', isAuthenticated, function (req, res) {
		res.render('fill_waste_ordinance', { user: req.user });
	});

	router.post('/new_waste_ordinance', function (req, res) {
		doc.writeWasteOrdinance(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nuevo acta de hallazgo de residuos generada!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	// -----------------------------------------------------------------------
	// -------------------------- ACCIDENTS ROUTES ---------------------------
	// -----------------------------------------------------------------------

	router.get('/home_accidents', isAuthenticated, function (req, res) {
		res.render('home_accidents', { user: req.user });
	});

	router.get('/fill_accident_2_vehicle', isAuthenticated, function (req, res) {
		res.render('fill_accident_2_vehicle', { user: req.user });
	});

	router.get('/fill_accident_3_vehicle', isAuthenticated, function (req, res) {
		res.render('fill_accident_3_vehicle', { user: req.user });
	});
	
	router.post('/new_accident_2_vehicle', isAuthenticated, function (req, res) {
		doc.writeAccident2Vehicle(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nuevo parte de accidente de 2 vehículos generado!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});
	

	router.post('/new_accident_3_vehicle', isAuthenticated, function (req, res) {
		doc.writeAccident3Vehicle(req.body, function (ret) {
			if (ret) {
				req.flash('message', '¡Nuevo parte de accidente de 3 vehículos generado!');
				res.redirect('home');
			}
			else {
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
		})
	});

	// -----------------------------------------------------------------------
	// -------------------------- SKETCH ROUTES ---------------------------
	// -----------------------------------------------------------------------

	router.get('/home_sketch', isAuthenticated, function (req, res) {
		res.render('home_sketch', { user: req.user });
	});

	router.get('/fill_send_sketch', isAuthenticated, function (req, res) {
		res.render('fill_send_sketch', { user: req.user });
	});

	router.post('/new_sketch', isAuthenticated, function (req, res) {
		if (!req.files)
			return res.status(400).send('No files were uploaded.');

			var sketch = req.files.sketch;

		// Use the mv() method to place the file somewhere on your server
		sketch.mv(CONSTANTS.path_to_images_folder+req.files.sketch.name, function (err) {
			if (err){
				req.flash('message', 'Ha ocurrido un error, por favor vuelva a intentarlo.');
				res.redirect('home');
			}
			else{
				req.flash('message', '¡Nuevo croquis almacenado!');
				res.redirect('home');
			}
		});
	});
	
	return router;
}





