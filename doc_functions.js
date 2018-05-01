"use strict"

const fs = require('fs');
const carbone = require('carbone');
var Incident = require('./models/incident');

class Doc {
   constructor() {
      this.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
         "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
   }

   writeBeginTurn(data){

      var date = new Date();
      var new_turn_data = {
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
               'ppll' : '{d.all_incidents[i].ppll}',
               'issue' : '{d.all_incidents[i].issue}',
               'operation' : '{d.all_incidents[i].operation}'
            },
            {
               'number_id': '{d.all_incidents[i+1].number_id}',
               'date': '{d.all_incidents[i+1].date}',
               'time': '{d.all_incidents[i+1].time}',
               'cen': '{d.all_incidents[i+1].cen}',
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

      }
      else if (data.turns_radio == "night") {
         new_turn_data.morning = ' ';
         new_turn_data.night = 'XX';
         new_turn_data.timetable = '22:00 a 7:00';
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
      Incident.find({}, function (err, incidents) {
         var all_incidents = [];
         var index = 0;
         incidents.forEach(function (incident) {
            all_incidents[index] = incident;
            index++;
         });
         
         var incidents_data = {
            "all_incidents" : all_incidents
         }
         carbone.render('/home/cervi/ChiefTemplates/new_turn_filled.odt', incidents_data, function (err, result) {
            if (err) {
               return console.log(err);
            }
            fs.writeFileSync('/home/cervi/ChiefTemplates/result_incidents.odt', result);
         });
      });

   }
   
}

module.exports = Doc