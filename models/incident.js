var mongoose = require('mongoose');

module.exports = mongoose.model('Incident', {
   number_id: Number,
   date: String,
   dep: String,
   cen: Number,
   ppll: Number,
   issue: String,
   operation: String
});