"use strict";

var scrypt = require("scrypt");

// scrypt.params(0.1).then(function(result){
// 	console.log("scrypt result is");
// 	console.log(result);
// 	return scrypt.kdf("password?", result);
// }).then(function(hashedresult){
// 	console.log("hashed result via srcypt.kdf is");
// 	console.log(hashedresult.toString("hex"));
// 	return scrypt.verifyKdf(hashedresult, "password?");
// }).then(function(verifyresult){
// 	console.log("verify result is ");
// 	console.log(verifyresult);
// }).catch(function(err){
// 	console.log("error occured");
// 	console.log(err);
// })


