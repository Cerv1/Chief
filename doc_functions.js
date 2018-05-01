"use strict"

const fs = require('fs');
const carbone = require('carbone');
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

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
         'month': monthNames[date.getMonth()],
         'date': date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear()
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
         fs.writeFileSync('/home/cervi/ChiefTemplates/result.odt', result);
      });
   }

   writeEndTurn(data){
      
   }
   
}

module.exports = Doc