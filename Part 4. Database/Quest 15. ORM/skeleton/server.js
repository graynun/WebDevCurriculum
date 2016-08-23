"use strict";

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	fs = require('fs'),
	app = express(),
	fileManager = new FileManager(),
	userManager = new UserManager();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(
	session({
		secret: 'change string whenvever I want to',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 2 * 60 * 1000
		}
	})
);


app.use('/', function(req, res, next){
	console.log("request session user at / is "+ req.session.user);
	console.log("app.use request sessionID is "+req.sessionID);
	next();
});

app.get('/login', function(req, res){
	console.log("app.get request sessionID at /login is "+req.sessionID);
	console.log(req.session);
	res.sendFile(path.join(__dirname, '/client/login.html'));
})


app.post('/loginClicked', function(req, res){
	console.log("get loginclicked got req.query? in get?");
	
	console.log(req.body.id);
	console.log(req.body.pw)

	var loginSuccess = userManager.authenticate(req.body.id, req.body.pw);

	if(loginSuccess[0]){
		req.session.save(function(err){
			req.session.user = req.body.id;
			console.log("signed in user is "+req.session.user);
			res.redirect('/main');			
		})
	}else{
		console.log("login failed with "+loginSuccess[1]);
		res.status(401).send(loginSuccess[1]);
	}
});

app.post('/logout', function(req, res){
	console.log("Ever called /logout?");
	console.log(req.body.tabs);
	console.log(req.body.selected);
	userManager.saveLastStatus(req.session.user, req.body.tabs, req.body.selected);
	req.session.destroy(function(err){
		if(err) throw err;
		res.redirect('/login');
	})
	
});


app.get('/main', function (req, res) {
	console.log("got /main get");
	res.sendFile(path.join(__dirname, '/client/index.html'));
});



/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */

var server = app.listen(8080, function () {
	console.log('Server started! at 8080');
});

app.post('/savefile', function(req, res){
	console.log("savefile had called");

	fileManager.createFile(req.session.user, req.body);
	res.end();
});

app.get('/reloadFileList', function(req, res){
	console.log("got reloadFileList req?");
	console.log(req.session);
	var fileArr = fileManager.readFileList(req.session.user);
	res.send(fileArr);
	console.log(fileArr);
	res.end();
});

app.get('/readFile', function(req, res){
	console.log(req.query.fileName);
	var data = fileManager.readFile(req.session.user, req.query.fileName);
	res.send(data);
	res.end();
})

app.get('/loadLastStatus', function(req, res){
	var responseContent = userManager.readLastStatus(req.session.user);
	res.send(responseContent);
	res.end();
})


function FileManager() {
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
}

FileManager.prototype.readFile = function(userID, fileName){
	this.dir = "./"+userID+"/";
	console.log(this.dir);
	console.log(this.dir+fileName+".txt");
	return fs.readFileSync(this.dir+fileName+".txt", 'utf8');
}


function UserManager(){
	this.userInfo = require('./userInfo.json');
	console.log(this.userInfo);
}


UserManager.prototype.authenticate = function(id, pw){
	if(this.userInfo[id] === undefined){
		console.log("there's no such user");
		return [false, "No such user"];
	}else{
		if(this.userInfo[id]['pw'] === pw){
			console.log("yay user authenticated!");
			return [true, this.userInfo[id]["lastTabs"],this.userInfo[id]["lastSelected"]];
		}else{
			return [false, "wrong password"];
		}
	}
}

UserManager.prototype.saveLastStatus = function(id, tabs, selected){
	console.log(tabs);
	console.log(selected);
	this.userInfo[id]["lastTabs"] = tabs;
	this.userInfo[id]["lastSelected"] = selected;
	console.log(this.userInfo);
	fs.writeFile('./userInfo.json', JSON.stringify(this.userInfo), function(err){
		if(err) throw err;
		console.log("updated lastStatus to the json file");
	});
}

UserManager.prototype.readLastStatus = function(id){
	var obj = {};
	obj["user"] = this.userInfo[id]['id'];
	obj["lastTabs"] = this.userInfo[id]["lastTabs"];
	obj["lastSelected"] = this.userInfo[id]["lastSelected"];
	return obj;
}
