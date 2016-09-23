var scrypt = require('scrypt');

// scrypt.params(0.2).then((param)=>{
// 	return scrypt.kdf("test1", param);
// }).then((hashedresult)=>{
// 	console.log(hashedresult);
// 	console.log(hashedresult.toString());
// 	return true;
// }).then((result)=>{
// 	console.log(result);
// })


scrypt.params(0.2).then((param)=>{
	console.log(param);
});