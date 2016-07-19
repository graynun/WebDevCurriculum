var http = require('http');

http.createServer(function(req, res) {
	// TODO: 이 곳을 채워넣으세요..!
	
	var barValueFinder = function(reqUrl){
		var reqStr = reqUrl.split("bar=");
		return reqStr[reqStr.length - 1];
	}

	if(req.method === "GET"){
		if(req.url === "/"){
			res.end("Hello World!");
		}else if(req.url.slice(0, 4) === "/foo"){
			res.end("Hello " + barValueFinder(req.url));
		}else{
			console.log("unexpected url " + req.url);
			res.end();
		}
	}else if(req.method === "POST"){
		if(req.url.slice(0, 4) === "/foo"){
			res.end("Hello " + barValueFinder(req.url));
		}else{
			console.log("unexpected url " + req.url);
			res.end();
		}
	}

}).listen(8080);

