var http = require('http');

http.createServer(function(req, res) {
	// TODO: 이 곳을 채워넣으세요..!
	
	var generateKeyAndValueObject = function(reqUrl){
		var reqStrArr = reqUrl.split(/\?|\&/g);
		if(reqUrl.slice(0, 4) === "/foo") reqStrArr.splice(0,1);

		var keyAndValueObj = {};
		for(var i=0;i<reqStrArr.length;i++){
			var keyAndValueArr = reqStrArr[i].split(/\=/);
			keyAndValueObj[keyAndValueArr[0]] = keyAndValueArr[1];
		}
		return keyAndValueObj;
	}


	if(req.method === "GET"){
		if(req.url === "/"){
			res.end("Hello World!");
		}else if(req.url.slice(0, 4) === "/foo"){
			var keyAndValueObj = generateKeyAndValueObject(req.url);
			if(keyAndValueObj['bar'] !== undefined) res.write("Hello, "+keyAndValueObj['bar']);
			res.end();
		}else{
			res.end("unexpected url " + req.url);
		}
	}else if(req.method === "POST"){
		if(req.url.slice(0, 4) === "/foo"){
			if(req.headers['content-type'] === "application/x-www-form-urlencoded" && req.headers['content-length'] !== '0'){
				var reqBody;
				req.on('data', function(chunk){
					 reqBody = chunk.toString();
				}).on('end', function(){
					var keyAndValueObj = generateKeyAndValueObject(reqBody);
					if(keyAndValueObj['bar'] !== undefined) {
						res.write("Hello, "+keyAndValueObj['bar']);
					}else{
						res.write("no bar on body");
					};
					res.end();
				})
			}else{
				res.end("nothing on body");
			}
		}else{
			res.end("unexpected url " + req.url);
		}
	}

}).listen(8080);

