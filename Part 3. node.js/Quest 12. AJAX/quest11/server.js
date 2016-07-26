var http = require('http'),
	fs = require('fs');

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
		console.log("ever got GET request?");
		console.log(req.url);

		if(req.url === "/loadClient" || req.url === "/loadClient?"){
			var html = fs.readFileSync('client.html');
			res.write(html);
			res.end();
		}else if(req.url === "/ajaxtest"){
			// res.writeHead(400, {
			// 	'Content-type': 'text/plain'
			// })
			setTimeout(function(){
				res.end("Hello World!")
			}, 3000);

		}else if(req.url.slice(0, 4) === "/foo"){
			var keyAndValueObj = generateKeyAndValueObject(req.url);
			if(keyAndValueObj['bar'] !== undefined) res.write("Hello, "+keyAndValueObj['bar']);
			res.end();
		}else{
			res.end("GET request unexpected url " + req.url);
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
		}else if(req.url === "/loadClient"){
			var reqBody;
			req.on('data', function(chunk){
				reqBody = chunk.toString();
			}).on('end', function(){
				console.log("POST request body content is "+ reqBody);
				res.write("body that the server received was "+ reqBody);
				res.end();
			});
		}else{
			res.end("POST request unexpected url " + req.url);
		}
	}

}).listen(8080);

