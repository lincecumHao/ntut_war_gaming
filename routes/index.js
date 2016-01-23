var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    
    if (sess.user.username == 'admin') {
        res.render('deshboard');
    } else {
        // res.render('index');
        res.render('deshboard');
    }
});

router.get('/index', function(req, res, next) {
    res.render('index');
});


module.exports = router;
