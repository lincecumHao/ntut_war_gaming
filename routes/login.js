var express = require('express');
var router = express.Router();
var $ = require("jquery");
var mongoose = require('mongoose');
var user = mongoose.model('user');
var department = mongoose.model('department');

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
            department.find({depart_id: user.subordinate}, function(err, depart){
                if(depart.length > 0){
                    var usertmp = user;
                    sess.user = user;
                    sess.depart = depart[0];
                    res.json({
                        status: 1,
                        error: "",
                        user: user,
                    });
                }
            });
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
    res.json({user: sess.user, depart: sess.depart});
});

module.exports = router;
