var express = require('express');
var router = express.Router();
var $ = require("jquery");
var mongoose = require('mongoose');
var user = mongoose.model('user');
var departments = mongoose.model('departments');

router.post('/login', function(req, res) {
    var sess = req.session;
    var post = req.body;
    var loginUser;
    user.find({
        username: post.username,
        password: post.password
    }
    // ).toArray()[0];
    // loginUser.department = department.find({id: loginUser.subordinate}).toArray[0];
    // console.log(loginUser);

    , function(err, users) {
        if (users.length == 0) {
            res.json({
                status: 0,
                error: "Login Failed"
            });
        } else {
            var user = users[0];
            if(user.username == "admin"){
                console.log("admin login");
                sess.user = user;
                res.json({
                        status: 1
                    });
            }
            departments.find({type: user.unit}, function(err, depart){
                if(depart.length > 0){
                    var usertmp = user;
                    sess.user = user;
                    sess.depart = depart;
                    res.json({
                        status: 1,
                        error: "",
                        user: user,
                    });
                }
            }).sort( { level: 1 } );

        }
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'express todo example'
    });
});

router.get('/logout', function(req, res) {
    var sess = req.session;
    delete sess.user
    res.redirect('/');
});

router.get('/currentUser', function(req, res) {
    var sess = req.session;
    res.json({user: sess.user, departs: sess.depart});
});

module.exports = router;
