var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var user = new Schema({
    name: String,
    username: String,
    password: String,
    subordinate: String
}, { collection: 'user' });

var department = new Schema({
    name: String,
    address: String
}, { collection: 'department' });

var Logs = new Schema({
    time: String,
    from: String,
    send: Array
}, { collection: 'Logs' });
 
mongoose.model( 'user', user );
mongoose.model( 'department', department );
mongoose.model( 'Logs', Logs );
mongoose.connect( 'mongodb://lincecum:O4dv6q9AJSHpFEH1dzjG@ds045684.mongolab.com:45684/war_game', function(err) {
    if (err) throw err;
} );