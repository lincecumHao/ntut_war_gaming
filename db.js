var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var user = new Schema({
    name: String,
    username: String,
    password: String,
    unit: String,
    subordinate: String
}, { collection: 'user' });

var department = new Schema({
    name: String,
    address: String
}, { collection: 'department' });

var departments = new Schema({
    level: Number,
    type: String,
    parent: String,
    name: String,
    phone: String,
    address: String,
    lat: Number,
    lng: Number,
    Resource: Object
}, { collection: 'departments' });

var Logs = new Schema({
    time: String,
    from: String,
    send: Array
}, { collection: 'Logs' });
 
mongoose.model( 'user', user );
mongoose.model( 'department', department );
mongoose.model( 'departments', departments );
mongoose.model( 'Logs', Logs );
mongoose.connect( 'mongodb://lincecum:O4dv6q9AJSHpFEH1dzjG@ds045684.mongolab.com:45684/war_game', function(err) {
    if (err) throw err;
<<<<<<< HEAD
} );
=======
} );
>>>>>>> 14525d9091d4c8d45f136981f3c2f12a1c66de14
