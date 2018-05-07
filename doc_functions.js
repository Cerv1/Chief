"use strict"

const fs = require('fs');
const carbone = require('carbone');
var Incident = require('./models/incident');

class Doc {
   constructor() {
      this.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
         "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      this.route_to_save_incidents = '/home/cervi/ChiefTemplates/Incidentes/';
      this.route_to_save_ordinance = '/home/cervi/ChiefTemplates/Ordenanzas/';
      this.morning = true;
      this.evening = false;
      this.night = false;
   }
   

	// -----------------------------------------------------------------------
	// -------------------------- INCIDENTS METHODS --------------------------
   // -----------------------------------------------------------------------
   
   writeBeginTurn(data){
      var date = new Date();
      var new_turn_data = {
         'year': date.getFullYear(),
         'month': this.monthNames[date.getMonth()],
         'pl1': data.pl1,
         'pl2': data.pl2,
         'pl3': data.pl3,
         'pl4': data.pl4,
         'morning': 'XX',
         'evening': ' ',
         'night': ' ',
         'timetable': '07:00 a 15:00',
         'turn_chief': data.turn_chief,
         'year': date.getFullYear(),
         'month': this.monthNames[date.getMonth()],
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
         new_turn_data.timetable = '15:00 a 22:00';
         this.morning = false;
         this.evening = true;
      }
      else if (data.turns_radio == "night") {
         new_turn_data.morning = ' ';
         new_turn_data.night = 'XX';
         new_turn_data.timetable = '22:00 a 07:00';
         this.morning = false;
         this.night = true;
         
      }

      carbone.render('/home/cervi/ChiefTemplates/Incidentes/incident_template.odt', new_turn_data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         // write the result
         fs.writeFileSync('/home/cervi/ChiefTemplates/Incidentes/new_turn_filled.odt', result);
      });
   }

   writeEndTurn(end_turn_data){
      var date = new Date();
      var today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
      var begin_turn, end_turn;
      var writeName = this.route_to_save_incidents + date.getDate() + '-' + (date.getMonth() + 1) + '-' 
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

         carbone.render('/home/cervi/ChiefTemplates/Incidentes/new_turn_filled.odt', end_turn_parameters, function (err, result) {
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
      var writeName = this.route_to_save_ordinance+'Limpieza/' + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + date.getMinutes() + '.odt';
      var minutes; 
      if(date.getMinutes() < 10 ){
         minutes = '0' + date.getMinutes();
      }
      else{
         minutes = date.getMinutes();
      }
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
         'month' : this.monthNames[date.getMonth()],
         'year' : date.getFullYear()
      }

      var i;
      for(i in data.infractions_checkbox){
         ordinance_data[data.infractions_checkbox[i]] = 'X';
      }
      
      carbone.render('/home/cervi/ChiefTemplates/Ordenanzas/Limpieza/acta_limpieza_template.odt', ordinance_data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         fs.writeFileSync(writeName, result);
      });
   }

   writeBotellonOrdinance(data){
      var date = new Date();
      var writeName = this.route_to_save_ordinance+'Ruidos/Botellon/' + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + date.getMinutes() + '.odt';
      var minutes; 

      if(date.getMinutes() < 10 ){
         minutes = '0' + date.getMinutes();
      }
      else{
         minutes = date.getMinutes();
      }

      var ordinance_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name' : this.monthNames[date.getMonth()],
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
  
      carbone.render('/home/cervi/ChiefTemplates/Ordenanzas/Ruidos/Botellon/acta_denuncia_botellon.odt', ordinance_data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         fs.writeFileSync(writeName, result);
      });
   }

   writeNoiseResidencyOrdinance(data){

      
      var date = new Date();
      var minutes;

      if (date.getMinutes() < 10) {
         minutes = '0' + date.getMinutes();
      }
      else {
         minutes = date.getMinutes();
      }
      var writeName = this.route_to_save_ordinance +'Ruidos/Ruidos_Domicilios/' + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + date.getMinutes() + '.odt';
      var ordinance_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name': this.monthNames[date.getMonth()],
         'year': date.getFullYear(),
         'pl1': data.pl1,
         'pl2': data.pl2,
         'incident_number': data.incident_number,
         'time': date.getHours() + ':' + date.getMinutes(),
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
  
      carbone.render('/home/cervi/ChiefTemplates/Ordenanzas/Ruidos/Ruidos_Domicilios/acta_denuncia_ruidos_domicilios.odt', ordinance_data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         fs.writeFileSync(writeName, result);
      });
   }

   writeNoiseEstablishmentOrdinance(data){
      var date = new Date();
      var minutes;

      if (date.getMinutes() < 10) {
         minutes = '0' + date.getMinutes();
      }
      else {
         minutes = date.getMinutes();
      }
      var writeName = this.route_to_save_ordinance +'Ruidos/Ruidos_Establecimientos/' + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + date.getMinutes() + '.odt';
      var ordinance_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name': this.monthNames[date.getMonth()],
         'year': date.getFullYear(),
         'pl1': data.pl1,
         'pl2': data.pl2,
         'incident_number': data.incident_number,
         'time': date.getHours() + ':' + date.getMinutes(),
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
  
      carbone.render('/home/cervi/ChiefTemplates/Ordenanzas/Ruidos/Ruidos_Establecimientos/acta_denuncia_ruidos_establecimientos.odt', ordinance_data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         fs.writeFileSync(writeName, result);
      });
   }

   writeNoiseMeasurementOrdinance(data){
      var date = new Date();
      var minutes;

      if (date.getMinutes() < 10) {
         minutes = '0' + date.getMinutes();
      }
      else {
         minutes = date.getMinutes();
      }
      var writeName = this.route_to_save_ordinance +'Ruidos/Ruidos_Medicion/' + date.getDate() + '-' + (date.getMonth() + 1) + '-'
         + date.getFullYear() + '_' + date.getHours() + ':' + date.getMinutes() + '.odt';
      var ordinance_botellon_data = {
         'locality': data.locality,
         'city': data.city,
         'hour': date.getHours(),
         'day': date.getDate(),
         'date': date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
         'month_name': this.monthNames[date.getMonth()],
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
         'medition_spot': data.sonometer_serial_number,
         'db_measured': data.db_measured,
         'db_exceeds': data.db_exceeds,
         'db_maximum': data.db_maximum,
         'minutes': data.minutes,
         'article': data.article
      }
  
      carbone.render('/home/cervi/ChiefTemplates/Ordenanzas/Ruidos/Ruidos_Medicion/acta_medicion_ruidos.odt', ordinance_botellon_data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         fs.writeFileSync(writeName, result);
      });
   }
   
}

module.exports = Doc