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
         ]
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