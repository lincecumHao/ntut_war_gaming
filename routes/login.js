var express = require('express');
var router = express.Router();
var $ = require("jquery");
var mongoose = require('mongoose');
var user = mongoose.model('user');

router.post('/login', function(req, res) {
    var sess = req.session;
    var post = req.body;
    user.find({
        username: post.username
    }, function(err, users, count) {
        var user = users[0];
        if (user == undefined || post.password !== user.password) {
            res.json({
                error: "login failed."
            });
        } else {
            sess.user = user;
            res.render("index");
        }
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'express todo example'
    });
});

router.get('/logout', function(req, res) {
    req.session.destroy;
    res.redirect('/login');
});

module.exports = router;
