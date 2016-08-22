"use strict";

var crypto = require('crypto');

var randomStr = function(length){
	var rand = crypto.randomBytes(Math.ceil(length/2))
	console.log(rand);
	console.log(rand.toString('hex'));
}


randomStr(15);