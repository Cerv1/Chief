"use strict"

const fs = require('fs');
const carbone = require('carbone');
var Incident = require('./models/incident');
const CONSTANTS = require('./constants');

class Doc {
	constructor() {
		this.morning = true;
		this.evening = false;
		this.night = false;
		this.reinforcement = false;
		this.reinforcement_begin = '';
		this.reinforcement_end = '';
		this.ret_value = false;
	}

	getMinutesWithFormat(){
		var date = new Date();
		var minutes;
		if (date.getMinutes() < 10) {
			minutes = '0' + date.getMinutes();
		}
		else {
			minutes = date.getMinutes();
		}
		return minutes;
	}

	send_ok(){
		this.ret_value = true;
	}

	send_err(){
		this.ret_value = false;
	}

	carboneWriter(template_path, path_to_save, data, _callback){
		var _this = this;
		carbone.render(template_path, data, function (err, result) {
			if (err) {
				_this.send_err()
				_callback()
			}
			else{
				// write the result
				fs.writeFileSync(path_to_save, result);
				_this.send_ok()
				_callback()
			}	
		});
	}

	
	appendTimeStampsToJSON(data){
		var date = new Date();
		var minutes = this.getMinutesWithFormat();
		data['day'] = date.getDate();
		data['month'] = date.getMonth();
		data['month_name'] = CONSTANTS.monthNames[date.getMonth()];
		data['year'] = date.getFullYear();
		data['hours'] = date.getHours();
		data['minutes'] = date.getMinutes();
		data['date'] = date.getDate() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear();
		data['time'] = date.getHours() + ':' + minutes;
		return data;
	}

	appendTimeStampToFile(){
		var date = new Date();
		var minutes = this.getMinutesWithFormat();
		return date.getDate() + '-' + (date.getMonth() + 1) + '-'
			+ date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';
	}

	createJSON(data){
		var json_data = {};
		var i;
		for (i in data) {
			json_data[i] = data[i];
		}
		this.appendTimeStampsToJSON(json_data);
		return json_data;
	}
	

		// -----------------------------------------------------------------------
		// -------------------------- INCIDENTS METHODS --------------------------
		// -----------------------------------------------------------------------
	
	writeBeginTurn(data, _ret){
		var date = new Date();
		var new_turn_data = {
			'year': date.getFullYear(),
			'month': CONSTANTS.monthNames[date.getMonth()],
			'pl1': data.pl1,
			'pl2': data.pl2,
			'pl3': data.pl3,
			'pl4': data.pl4,
			'morning': ' ',
			'evening': ' ',
			'night': ' ',
			'timetable': ' ',
			'turn_chief': data.turn_chief,
			'year': date.getFullYear(),
			'month': CONSTANTS.monthNames[date.getMonth()],
			'date': date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear(),
			'all_incidents' : [
				{
					'number_id' : '{d.all_incidents[i].number_id}',
					'date' : '{d.all_incidents[i].date}',
					'time' : '{d.all_incidents[i].time}',
					'cen' : '{d.all_incidents[i].cen}',
					'dep': '{d.all_incidents[i].dep}',
					'ppll' : '{d.all_incidents[i].ppll}',
					'issue' : '{d.all_incidents[i].issue}',
					'operation' : '{d.all_incidents[i].operation}'
				},
				{
					'number_id': '{d.all_incidents[i+1].number_id}',
					'date': '{d.all_incidents[i+1].date}',
					'time': '{d.all_incidents[i+1].time}',
					'cen': '{d.all_incidents[i+1].cen}',
					'dep': '{d.all_incidents[i+1].dep}',
					'ppll': '{d.all_incidents[i+1].ppll}',
					'issue': '{d.all_incidents[i+1].issue}',
					'operation': '{d.all_incidents[i+1].operation}'
				}
			],
			'various_ord' : '{d.various_ord}',
			'road_incidents' : '{d.road_incidents}',
			'reports' : '{d.reports}',
			'others' : '{d.others}',
			'denounce_4-15' : '{d.denounce_4-15}',
			'appre_rec' : '{d.appre_rec}',
			'identifications' : '{d.identifications}',
			'crowded' : '{d.crowded}',
			'arrested' : '{d.arrested}',
			'alcoho' : '{d.alcoho}',
			'appearances' : '{d.appearances}',
			'cranes' : '{d.cranes}',
			'friendly_acc' : '{d.friendly_acc}',
			'injured_acc' : '{d.injured_acc}',
			'no_injured_acc' : '{d.no_injured_acc}',
			'others_acc' : '{d.others_acc}',
			'pl1_ord_tr' : '{d.pl1_ord_tr}',
			'pl1_jp_tr' : '{d.pl1_jp_tr}',
			'pl2_ord_tr' : '{d.pl2_ord_tr}',
			'pl2_jp_tr' : '{d.pl2_jp_tr}',
			'pl3_ord_tr' : '{d.pl3_ord_tr}',
			'pl3_jp_tr' : '{d.pl3_jp_tr}',
			'pl4_ord_tr' : '{d.pl4_ord_tr}',
			'pl4_jp_tr' : '{d.pl4_jp_tr}',
			'pl5_ord_tr' : '{d.pl5_ord_tr}',
			'pl5_jp_tr' : '{d.pl5_jp_tr}',
			'vehicles' : '{d.vehicles}',
			'motorcycles' : '{d.motorcycles}',
			'catered' : '{d.catered}',
			'done' : '{d.done}',
			'km_begin' : '{d.km_begin}',
			'km_end' : '{d.km_end}',
			'car_refueling' : '{d.car_refueling}',
			'moto_refueling' : '{d.moto_refueling}',
			'exterior' : '{d.exterior}',
			'interior' : '{d.interior}',
			'service_order' : '{d.service_order}'
		};

		if (data.turns_radio == "evening") {
			new_turn_data.morning = ' ';
			new_turn_data.evening = 'XX';
			new_turn_data.night = ' ';
			new_turn_data.timetable = '15:00 a 22:00';
			this.morning = false;
			this.evening = true;
			this.night = false;
			this.reinforcement = false;
		}
		else if (data.turns_radio == "night") {
			new_turn_data.morning = ' ';
			new_turn_data.evening = ' ';
			new_turn_data.night = 'XX';
			new_turn_data.timetable = '22:00 a 07:00';
			this.morning = false;
			this.evening = false;
			this.night = true;
			this.reinforcement = false;
		}
		else if (data.turns_radio == "morning") {
			new_turn_data.morning = 'XX';
			new_turn_data.evening = ' ';
			new_turn_data.night = ' ';
			new_turn_data.timetable = '07:00 a 15:00';
			this.morning = true;
			this.evening = false;
			this.night = false;
			this.reinforcement = false;
		}
		else if (data.turns_radio == "reinforcement") {
			this.reinforcement_begin = data.begin_turn;
			this.reinforcement_end = data.end_turn;
			new_turn_data.reinforcement = 'XX';
			new_turn_data.timetable = this.reinforcement_begin + ' a ' + this.reinforcement_end;
			this.morning = false;
			this.evening = false;
			this.night = false;
			this.reinforcement = true;
		}
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_incident_template, CONSTANTS.path_to_new_turn_template, new_turn_data, function(){
			_ret(_this.ret_value);
		});
	}

	writeEndTurn(end_turn_data, _ret){
		var date = new Date();
		var today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
		var begin_turn, end_turn;
		var writeName = CONSTANTS.path_to_incidents_folder + date.getDate() + '-' + (date.getMonth() + 1) + '-' 
							+ date.getFullYear();

		if(this.morning){
			begin_turn = '07:00';
			end_turn = '15:00';
			writeName += '_Mañana.odt';
		}
		else if(this.evening){
			begin_turn = '15:00';
			end_turn = '22:00';
			writeName += '_Tarde.odt';
		}
		else if(this.night){
			begin_turn = '22:00';
			end_turn = '07:00';
			writeName += '_Noche.odt';
		}
		else if(this.reinforcement){
			begin_turn = this.reinforcement_begin;
			end_turn = this.reinforcement_end;
			writeName += '_Refuezo.odt';
		}
		var _this = this;

		Incident.find({'date' : today}, function (err, incidents) {
			var all_incidents = [];
			var index = 0;
			incidents.forEach(function (incident) {
				if(incident.time >= begin_turn && incident.time <= end_turn){
					all_incidents[index] = incident;
					index++;
				}
			});
			
			var end_turn_parameters = end_turn_data;
			end_turn_parameters['all_incidents'] = all_incidents;

			_this.carboneWriter(CONSTANTS.path_to_new_turn_template, writeName, end_turn_parameters, function(){
				_ret(_this.ret_value);
			}) 

		});
	}

		// -----------------------------------------------------------------------
		// -------------------------- ORDINANCES METHODS -------------------------
	// -----------------------------------------------------------------------
	
	writeCleanOrdinance(data, _ret){
		
		var writeName = CONSTANTS.path_to_clean_folder + this.appendTimeStampToFile();

		var ordinance_data = {};
		ordinance_data = this.createJSON(data);

		var i;
		for(i in data.infractions_checkbox){
			ordinance_data[data.infractions_checkbox[i]] = 'X';
		}
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_clean_template, writeName, ordinance_data, function(){
			_ret(_this.ret_value);
		});
	}

	writeBotellonOrdinance(data, _ret){
		var writeName = CONSTANTS.path_to_botellon_folder + this.appendTimeStampToFile();
		
		var ordinance_data = {};
		ordinance_data = this.createJSON(data);
  
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_botellon_template, writeName, ordinance_data, function () {
			_ret(_this.ret_value);
		});

	}

	writeNoiseResidencyOrdinance(data, _ret){
		var writeName = CONSTANTS.path_to_home_noise_folder + this.appendTimeStampToFile();

		var ordinance_data = {};
		ordinance_data = this.createJSON(data);
  
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_home_noise_template, writeName, ordinance_data, function () {
			_ret(_this.ret_value);
		});
	}

	writeNoiseEstablishmentOrdinance(data, _ret){
		var writeName = CONSTANTS.path_to_establishment_noise_folder + this.appendTimeStampToFile();
			
		var ordinance_data = {};
		ordinance_data = this.createJSON(data);
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_establishment_noise_template, writeName, ordinance_data, function () {
			_ret(_this.ret_value);
		});

	}

	writeNoiseMeasurementOrdinance(data, _ret){
		var writeName = CONSTANTS.path_to_noise_measurement_folder + this.appendTimeStampToFile();

		var ordinance_data = {};
		ordinance_data = this.createJSON(data);
  
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_noise_measurement_template, writeName, ordinance_data, function () {
			_ret(_this.ret_value);
		});
	}

	writeBuildingInspectionOrdinance(data, _ret){
		var writeName = CONSTANTS.path_to_building_inspection_folder + this.appendTimeStampToFile();
		
		var ordinance_data = {};
		ordinance_data = this.createJSON(data);

		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_building_inspection_template, writeName, ordinance_data, function () {
			_ret(_this.ret_value);
		});
	}

	writeWasteOrdinance(data, _ret){
		var writeName = CONSTANTS.path_to_waste_inspection_folder + this.appendTimeStampToFile();

		var ordinance_data = {};
		ordinance_data = this.createJSON(data);

		var i;
		for (i in data.liquids_checkbox) {
			ordinance_data[data.liquids_checkbox[i]] = 'X';
		}

		for (i in data.solids_checkbox) {
			ordinance_data[data.solids_checkbox[i]] = 'X';
		}
		
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_waste_inspection_template, writeName, ordinance_data, function () {
			_ret(_this.ret_value);
		});
	}
	
	writeAccident2Vehicle(data, _ret){
		var writeName = CONSTANTS.path_to_accident_2_vehicles_folder + this.appendTimeStampToFile();
		var accident_data = this.createJSON(data);
		var i;
		var data_to_fill = [];

		for (i in data.signaling_checkbox) {
			accident_data[data.signaling_checkbox[i]] = ' X';
		}

		if(typeof data.injured_names == "string"){
			data_to_fill[0] = {
				'vehicle': data.injured_vehicle,
				'name': data.injured_names,
				'residency': data.injured_residency,
				'assisted': data.injured_assisted,
				'registered': data.injured_registered
			}
		}
		else{
			for(i in data.injured_names){
				data_to_fill[i] = {
					'vehicle' : data.injured_vehicle[i],
					'name' : data.injured_names[i],
					'residency' : data.injured_residency[i],
					'assisted' : data.injured_assisted[i],
					'registered' : data.injured_registered[i]
				}
			}
		}

		accident_data['injured_data'] = data_to_fill;
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_accident_2_vehicles_template, writeName, accident_data, function () {
			_ret(_this.ret_value);
		});
	}

	writeAccident3Vehicle(data, _ret){
		var writeName = CONSTANTS.path_to_accident_3_vehicles_folder + this.appendTimeStampToFile();
		var accident_data = this.createJSON(data);
		var i;
		var data_to_fill = [];

		for (i in data.signaling_checkbox) {
			accident_data[data.signaling_checkbox[i]] = ' X';
		}

		if(typeof data.injured_names == "string"){
			data_to_fill[0] = {
				'vehicle': data.injured_vehicle,
				'name': data.injured_names,
				'residency': data.injured_residency,
				'assisted': data.injured_assisted,
				'registered': data.injured_registered
			}
		}
		else{
			for(i in data.injured_names){
				data_to_fill[i] = {
					'vehicle' : data.injured_vehicle[i],
					'name' : data.injured_names[i],
					'residency' : data.injured_residency[i],
					'assisted' : data.injured_assisted[i],
					'registered' : data.injured_registered[i]
				}
			}
		}

		accident_data['injured_data'] = data_to_fill;
		var _this = this;
		this.carboneWriter(CONSTANTS.path_to_accident_3_vehicles_template, writeName, accident_data, function () {
			_ret(_this.ret_value);
		});
	}
	
}

module.exports = Doc
