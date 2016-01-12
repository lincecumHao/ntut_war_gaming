var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var user = new Schema({
    name: String,
    username: String,
    password: String,
    subordinate: String
}, { collection: 'user' });
 
mongoose.model( 'user', user );
mongoose.connect( 'mongodb://lincecum:O4dv6q9AJSHpFEH1dzjG@ds045684.mongolab.com:45684/war_game', function(err) {
    if (err) throw err;
} );