"use strict";

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	app = express(),
	fileManager = new FileManager();

app.use(express.static('client'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */

var server = app.listen(8080, function () {
	console.log('Server started!');
});

app.post('/savefile', function(req, res){
	console.log("savefile had called");

	fileManager.createFile(req.body);
	res.end();
});

app.get('/reloadFileList', function(req, res){
	console.log("got reloadFileList");

	var fileArr = fileManager.readFileList();
	res.send(fileArr);
	res.end();
});

app.get('/readFile', function(req, res){
	console.log("got readfile get fileName "+req.query.fileName);

	var data = fileManager.readFile(req.query.fileName);
	res.send(data);
	res.end();
})


function FileManager() {
	this.dir = './notepad_files/';
};

FileManager.prototype.createFile = function(reqBody){
	fs.writeFile(this.dir+reqBody.title+'.txt', reqBody.content,
		function(err){
			if(err) throw err;
			console.log("file "+reqBody.title+" created!");
		}
	);
}

FileManager.prototype.readFileList = function(){
	var fileNameArr = fs.readdirSync(this.dir);
	if(fileNameArr[0] === ".DS_Store") fileNameArr.splice(0,1);
	for(var i=0;i<fileNameArr.length;i++){
		fileNameArr[i] = fileNameArr[i].split(/.txt$/)[0];
	}
	return fileNameArr;
	//async하게는 만들 수 없는 것일까?
}

FileManager.prototype.readFile = function(fileName){
	return fs.readFileSync(this.dir+fileName+".txt", 'utf8');
	//async하게는 만들 수 없는 것일까?
}