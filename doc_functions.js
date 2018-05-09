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

   carboneWriter(template_path, path_to_save, data){
      carbone.render(template_path, data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         // write the result
         fs.writeFileSync(path_to_save, result);
      });
   }
   

	// -----------------------------------------------------------------------
	// -------------------------- INCIDENTS METHODS --------------------------
   // -----------------------------------------------------------------------
   
   writeBeginTurn(data){
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
         'exterior' : '{d.exterior}',
         'interior' : '{d.interior}'
      };

      if (data.turns_radio == "evening") {
         new_turn_data.morning = ' ';
         new_turn_data.evening = 'XX';
         new_turn_data.night = ' ';
         new_turn_data.timetable = '15:00 a 22:00';
         this.morning = false;
         this.evening = true;
         this.night = false;
      }
      else if (data.turns_radio == "night") {
         new_turn_data.morning = ' ';
         new_turn_data.evening = ' ';
         new_turn_data.night = 'XX';
         new_turn_data.timetable = '22:00 a 07:00';
         this.morning = false;
         this.evening = false;
         this.night = true;
      }
      else if (data.turns_radio == "morning") {
         new_turn_data.morning = 'XX';
         new_turn_data.evening = ' ';
         new_turn_data.night = ' ';
         new_turn_data.timetable = '07:00 a 15:00';
         this.morning = true;
         this.evening = false;
         this.night = false;
      }

      this.carboneWriter(CONSTANTS.path_to_incident_template, CONSTANTS.path_to_new_turn_template, new_turn_data);
   }

   writeEndTurn(end_turn_data){
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

      Incident.find({'date' : today}, function (err, incidents) {
         var all_incidents = [];
         var index = 0;
         incidents.forEach(function (incident) {
            console.log(incident.time >= begin_turn);
            if(incident.time >= begin_turn && incident.time <= end_turn){
               all_incidents[index] = incident;
               index++;
            }
         });
         
         var end_turn_parameters = end_turn_data;
         end_turn_parameters['all_incidents'] = all_incidents;

         carbone.render(CONSTANTS.path_to_new_turn_template, end_turn_parameters, function (err, result) {
            if (err) {
               return console.log(err);
            }
            fs.writeFileSync(writeName, result);
         });
      });
   }

	// -----------------------------------------------------------------------
	// -------------------------- ORDINANCES METHODS -------------------------
   // -----------------------------------------------------------------------
   
   writeCleanOrdinance(data){
      var date = new Date();
      var minutes = this.getMinutesWithFormat();
      var writeName = CONSTANTS.path_to_clean_folder + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';
      var ordinance_data = {
         'name': data.name,
         'dni': data.dni,
         'residency': data.residency,
         'other': data.other,
         'pl1': data.pl1,
         'pl2': data.pl2,
         'desc_6': data.desc_6,
         'place' : data.place,
         'date': date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear(),
         'time': date.getHours() + ':' + minutes,
         'day': date.getDate(),
         'month' : CONSTANTS.monthNames[date.getMonth()],
         'year' : date.getFullYear()
      }

      var i;
      for(i in data.infractions_checkbox){
         ordinance_data[data.infractions_checkbox[i]] = 'X';
      }

      this.carboneWriter(CONSTANTS.path_to_clean_template, writeName, ordinance_data);
   }

   writeBotellonOrdinance(data){
      var date = new Date();
      var minutes = this.getMinutesWithFormat();

      var writeName = CONSTANTS.path_to_botellon_folder + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';
      

      var ordinance_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name' : CONSTANTS.monthNames[date.getMonth()],
         'year' : date.getFullYear(),
         'pl1': data.pl1,
         'pl2': data.pl2,
         'incident_number': data.incident_number,
         'time': date.getHours() + ':' + minutes,
         'place': data.place,
         'cause': data.cause,
         'name': data.name,
         'dni': data.dni,
         'residency': data.residency,
         'elements': data.elements
      }
  
      this.carboneWriter(CONSTANTS.path_to_botellon_template, writeName, ordinance_data);

   }

   writeNoiseResidencyOrdinance(data){
      var date = new Date();
      var minutes = this.getMinutesWithFormat();

      var writeName = CONSTANTS.path_to_home_noise_folder + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';

      var ordinance_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name': CONSTANTS.monthNames[date.getMonth()],
         'year': date.getFullYear(),
         'pl1': data.pl1,
         'pl2': data.pl2,
         'incident_number': data.incident_number,
         'time': date.getHours() + ':' + minutes,
         'place_type': data.place_type,
         'place': data.place,
         'owner_dni': data.owner_dni,
         'owner_name': data.owner_dni,
         'cause': data.cause,
         'cause_place': data.cause_place,
         'name': data.name,
         'responsable_name': data.responsable_name,
         'responsable_dni': data.responsable_dni,
         'responsable_residency': data.responsable_residency,
         'article': data.article
      }
  
      this.carboneWriter(CONSTANTS.path_to_home_noise_template, writeName, ordinance_data);
   }

   writeNoiseEstablishmentOrdinance(data){
      var date = new Date();
      var minutes = this.getMinutesWithFormat();

      var writeName = CONSTANTS.path_to_establishment_noise_folder+ date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';
      var ordinance_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name': CONSTANTS.monthNames[date.getMonth()],
         'year': date.getFullYear(),
         'pl1': data.pl1,
         'pl2': data.pl2,
         'incident_number': data.incident_number,
         'time': date.getHours() + ':' + minutes,
         'place_type': data.place_type,
         'place': data.place,
         'owner_dni': data.owner_dni,
         'owner_name': data.owner_dni,
         'cause': data.cause,
         'cause_place': data.cause_place,
         'establishment_place': data.establishment_place,
         'establishment_name': data.establishment_name,
         'establishment_activity': data.establishment_activity,
         'name': data.name,
         'responsable_name': data.responsable_name,
         'responsable_dni': data.responsable_dni,
         'responsable_residency': data.responsable_residency,
         'article': data.article
      }
  
      this.carboneWriter(CONSTANTS.path_to_establishment_noise_template, writeName, ordinance_data);

   }

   writeNoiseMeasurementOrdinance(data){
      var date = new Date();
      var minutes = this.getMinutesWithFormat();

      var writeName = CONSTANTS.path_to_noise_measurement_folder + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';

      var ordinance_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name': CONSTANTS.monthNames[date.getMonth()],
         'year': date.getFullYear(),
         'pl1': data.pl1,
         'pl2': data.pl2,
         'incident_number': data.incident_number,
         'time': date.getHours() + ':' + minutes,
         'place_type': data.place_type,
         'place': data.place,
         'dni': data.dni,
         'name': data.name,
         'cause': data.cause,
         'establishment_place': data.establishment_place,
         'establishment_name': data.establishment_name,
         'establishment_activity': data.establishment_activity,
         'sonometer_brand': data.sonometer_brand,
         'sonometer_model': data.sonometer_model,
         'sonometer_serial_number': data.sonometer_serial_number,
         'medition_spot': data.metition_spot,
         'db_measured': data.db_measured,
         'db_exceeds': data.db_exceeds,
         'db_maximum': data.db_maximum,
         'minutes': data.minutes,
         'article': data.article
      }
  
      this.carboneWriter(CONSTANTS.path_to_noise_measurement_template, writeName, ordinance_data);
   }

   writeBuildingInspectionOrdinance(data){
      console.log(data);
      var date = new Date();
      var minutes = this.getMinutesWithFormat();

      var writeName = CONSTANTS.path_to_building_inspection_folder + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';

      var ordinance_data = {
         'place': data.place,
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'time': date.getHours() + ':' + minutes,
         'manager_name': data.manager_name,
         'manager_dni': data.manager_dni,
         'manager_type': data.manager_type,
         'owner_name': data.owner_name,
         'owner_dni': data.owner_dni,
         'owner_residency': data.owner_residency,
         'work_name': data.work_name,
         'work_company': data.work_company,
         'work_dni': data.work_dni,
         'work_residency': data.work_residency,
         'work_phone': data.work_phone,
         'license_number': data.license_number,
         'minor_work': data.minor_work,
         'public_ocupation': data.public_ocupation,
         'work_containers': data.work_containers,
         'others': data.others,
         'work_type': data.work_type,
         'work_detailed': data.work_detailed,
         'local_for': data.local_for,
         'acta': data.acta,
         'day': date.getDate(),
         'month': (date.getMonth() + 1),
         'month_name': CONSTANTS.monthNames[date.getMonth()],
         'year': date.getFullYear(),
         'pl1': data.pl1,
         'pl2': data.pl2
      }

      this.carboneWriter(CONSTANTS.path_to_building_inspection_template, writeName, ordinance_data);
   }

   writeWasteOrdinance(data){
      var date = new Date();
      var minutes = this.getMinutesWithFormat();

      var writeName = CONSTANTS.path_to_waste_inspection_folder + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + minutes + '.odt';
      var ordinance_data = {
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'time': date.getHours() + ':' + minutes,
         'place': data.place,
         'name': data.name,
         'dni': data.dni,
         'residency': data.residency,
         'phone': data.phone,
         'other_liquid_desc': data.other_liquid_desc,
         'other_solid_desc': data.other_solid_desc,
         'cause': data.cause,
         'observations': data.observations,
         'allegations': data.allegations,
         'pl1': data.pl1,
         'pl2': data.pl2,
      }
      var i;
      for (i in data.solids_checkbox) {
         console.log(data.solids_checkbox[i]);
         ordinance_data[data.solids_checkbox[i]] = 'X';
      }
      for (i in data.liquids_checkbox) {
         console.log(data.liquids_checkbox[i]);
         ordinance_data[data.liquids_checkbox[i]] = 'X';
      }
      

      this.carboneWriter(CONSTANTS.path_to_waste_inspection_template, writeName, ordinance_data);
   }
   
}

module.exports = Doc