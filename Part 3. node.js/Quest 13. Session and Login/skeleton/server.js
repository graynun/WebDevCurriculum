"use strict";

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	// cookieParser = require('cookie-parser'),
	session = require('express-session'),
	fs = require('fs'),
	app = express(),
	fileManager = new FileManager(),
	currentUser;

app.use(express.static('client'));
app.use(bodyParser.json());
// app.use(cookieParser());
app.use(
	session({
		secret: 'keyboardCat',
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			maxAge: 60000
		}
	})
);


app.get('/login', function(req, res){
	console.log("1 request sessionID is "+req.sessionID);
	console.log(req.session);
	res.sendFile(path.join(__dirname, '/client/login.html'));
})

app.get('/loginClicked', function(req, res){
	console.log("request id is "+req.query.id);
	console.log("request pw is "+req.query.pw);
	console.log("get loginclicked got req.query?");

	if(userInfo[req.query.id] === undefined){
		console.log("there's no such user");
		res.status(404).send("No such user!");
	}else{
		if(userInfo[req.query.id]['pw'] === req.query.pw){
			console.log("yay user authenticated!");
			req.session.user = req.query.id;
			console.log("signed in user is "+req.session.user);
			res.locals.user = req.session.user;
			res.redirect(301, '/');			
		}else{
			console.log("wrong password :P");
			res.status(401).send("Wrong password!");
		}
	}
})


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
	// next();
});

app.use('/', function(req, res, next){
	console.log("request session user at / is "+ req.session.user);
	console.log("response local user at / is "+res.locals.user);
	console.log("2 request sessionID is "+req.sessionID);
	// console.log("userInfo sessionID is "+ userInfo.sessionID);
	// if(req.sessionID === userInfo.sessionID) console.log("the same user came back!");
	// res.end();
	next();
})

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */

var server = app.listen(8080, function () {
	console.log('Server started! at 8080');
});

app.post('/savefile', function(req, res){
	console.log("savefile had called");

	fileManager.createFile(req.body);
	res.end();
});

app.get('/reloadFileList', function(req, res){
	console.log("got reloadFileList req?");
	console.log(req.session.user);
	var fileArr = fileManager.readFileList(req.session.user);
	res.send(fileArr);
	console.log(fileArr);
	res.end();
});

app.get('/readFile', function(req, res){
	var data = fileManager.readFile(req.query.fileName);
	res.send(data);
	// console.log(data);
	// res.status(300);
	res.end();
})


function FileManager() {
	// this.dir = './notepad_files/';
	// this.dir = './user1/';
	// this.dir = './user2/';
	this.dir;
};

FileManager.prototype.createFile = function(userID, reqBody){
	this.dir = "./"+userID+"/";
	fs.writeFile(this.dir+reqBody.title+'.txt', reqBody.content,
		function(err){
			if(err) throw err;
			console.log("file "+reqBody.title+" created!");
		}
	);
}

FileManager.prototype.readFileList = function(userID){
	this.dir = "./"+userID+"/";
	var fileNameArr = fs.readdirSync(this.dir);
	if(fileNameArr[0] === ".DS_Store") fileNameArr.splice(0,1);
	for(var i=0;i<fileNameArr.length;i++){
		fileNameArr[i] = fileNameArr[i].split(/.txt$/)[0];
	}
	return fileNameArr;
	//async하게는 만들 수 없는 것일까?
}

FileManager.prototype.readFile = function(userID, fileName){
	this.dir = "./"+userID+"/";
	return fs.readFileSync(this.dir+fileName+".txt", 'utf8');
	//async하게는 만들 수 없는 것일까?
}

var userInfo = {
	user1: {
		sessionID: null,
		id: "user1",
		pw: "test1"
	},
	user2: {
		sessionID: null,
		id: "user2",
		pw: "test2"
	},
	user3: {
		sessionID: null,
		id: "user3",
		pw: "test3"
	}
}