var http = require('http');

http.createServer(function(req, res) {
	// TODO: 이 곳을 채워넣으세요..!
	
	var generateKeyAndValueObject = function(reqUrl){
		var reqStrArr = reqUrl.split(/\?|\&/g);
		reqStrArr.splice(0,1);
		
		var keyAndValueObj = {};
		for(var i=0;i<reqStrArr.length;i++){
			var keyAndValueArr = reqStrArr[i].split(/\=/);
			keyAndValueObj[keyAndValueArr[0]] = keyAndValueArr[1];
		}

		return keyAndValueObj;
	}

	var generateResponse = function(keyAndValueObj){
		for (key in keyAndValueObj){
			res.write("Hello " + keyAndValueObj[key]+"\n");
		};
	}


	if(req.method === "GET"){
		if(req.url === "/"){
			res.end("Hello World!");
		}else if(req.url.slice(0, 4) === "/foo"){
			var keyAndValueObj = generateKeyAndValueObject(req.url);
			generateResponse(keyAndValueObj);
			res.end();
		}else{
			res.end("unexpected url " + req.url);
		}
	}else if(req.method === "POST"){
		if(req.url.slice(0, 4) === "/foo"){
			var keyAndValueObj = generateKeyAndValueObject(req.url);
			generateResponse(keyAndValueObj);
			res.end();
		}else{
			res.end("unexpected url " + req.url);
		}
	}

}).listen(8080);

