"use strict"

const fs = require('fs');
const carbone = require('carbone');
var Incident = require('./models/incident');

class Doc {
   constructor() {
      this.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
         "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      this.route_to_save = '/home/cervi/ChiefTemplates/';
      this.morning = true;
      this.evening = false;
      this.night = false;
   }

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
         'timetable': '7:00 a 15:00',
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
         new_turn_data.timetable = '22:00 a 7:00';
         this.morning = false;
         this.night = true;
         
      }

      carbone.render('/home/cervi/ChiefTemplates/incident_template.odt', new_turn_data, function (err, result) {
         if (err) {
            return console.log(err);
         }
         // write the result
         fs.writeFileSync('/home/cervi/ChiefTemplates/new_turn_filled.odt', result);
      });
   }

   writeEndTurn(){
      var date = new Date();
      var today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
      var begin_turn, end_turn;
      var writeName = this.route_to_save + date.getDate() + '-' + (date.getMonth() + 1) + '-' 
                     + date.getFullYear() + '_' + date.getHours() + ':' + date.getMinutes() +'.odt';

      if(this.morning){
         begin_turn = '07:00';
         end_turn = '15:00';
      }
      else if(this.evening){
         begin_turn = '15:00';
         end_turn = '22:00';
      }
      else if(this.night){
         begin_turn = '22:00';
         end_turn = '07:00';
      }

      Incident.find({'date' : today}, function (err, incidents) {
         var all_incidents = [];
         var index = 0;
         incidents.forEach(function (incident) {
            console.log(incident.time);

            console.log(incident.time >= begin_turn);
            if(incident.time >= begin_turn && incident.time <= end_turn){
               all_incidents[index] = incident;
               index++;
            }
         });

         var incidents_data = {
            "all_incidents" : all_incidents
         }

         carbone.render('/home/cervi/ChiefTemplates/new_turn_filled.odt', incidents_data, function (err, result) {
            if (err) {
               return console.log(err);
            }
            fs.writeFileSync(writeName, result);
         });
      });

   }
   
}

module.exports = Doc