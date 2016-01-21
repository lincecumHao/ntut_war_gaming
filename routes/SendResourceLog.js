var express = require('express');
var mongoose = require('mongoose');
var Log = mongoose.model('Logs');
var router = express.Router();

router.post('/', function(req, res, next) {
	var sendAry = [];
  var tmp = {};
  var flag = 0;
	Object.keys(req.body).forEach(function(key) {
    var value = req.body[key];
    if(flag == 0){
      tmp.name = value;
      flag++;
    }else if(flag == 1){
      if(value != '0'){
        tmp.count = value;
        sendAry.push(tmp);
      }
      flag = 0;
      tmp = {};
    }
  });

	console.log(sendAry);

  var sendLog = new Log({
    time: new Date(),
    from: req.session.user.name,
    send: sendAry
  });

	sendLog.save(function (err, data) {
    if (err) res.json({status: err});
    else res.json({status: 1});
  });
  
});

module.exports = router;
