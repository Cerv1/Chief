var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    email: String,
    name: String,
    surname: String,
    password: String
});