var express = require('express');
var router = express.Router();

//middleware
router.use(function(req, res, next) {
    sess = req.session;
    if (sess.user == undefined) {
        console.log('You are not authorized to view this page');
        res.render('login');
    } else {
    	console.log("Login.");
        next();
    }
});

module.exports = router;