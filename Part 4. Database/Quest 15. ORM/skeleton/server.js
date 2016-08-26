"use strict";

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	mysql = require('mysql'),
	Sequelize = require('sequelize'),
	dbaccessinfo = require('../sequelizeTest/dbaccess.js'),
	fs = require('fs'),
	app = express(),
	fileManager = new FileManager(),
	dbManager = new DBManager();

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

var sequelize = new Sequelize(dbaccessinfo.dbname, dbaccessinfo.account, dbaccessinfo.password, {
	host: 'localhost',
	dialect: 'mysql'
});

var Users = sequelize.define('Users', {
	user_id: {
		type: Sequelize.STRING,
		field: 'user_id',
		allowNull: false,
	},
	hashed_password: {
		type: Sequelize.STRING,
		field: 'hashed_password',
		allowNull: false
	},
	nickname: {
		type: Sequelize.STRING,
	}
}, {
	freezeTableName: true,
	underscored: true,
	charset: 'utf8'
});

Users.sync();

var Notes = sequelize.define('Notes', {
	note_id: {
		type: Sequelize.INTEGER(255).UNSIGNED,
		field: 'note_id',
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	author: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'author',
		allowNull: false
	},
	notename: {
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.TEXT,
		field: 'content',
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	freezeTableName: true,
	underscored: true,
	charset: 'utf8'
})

Notes.sync();


var Lastopened = sequelize.define('Lastopened', {
	note_id: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'note_id',
		allowNull: false
	},
	author: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'author',
		allowNull: false
	},
	selected: {
		type: Sequelize.BOOLEAN,
		field: 'selected',
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	freezeTableName: true,
	underscored: true,
	charset: 'utf8'
})

Lastopened.sync();




app.use('/', function(req, res, next){
	console.log("request session user at / is "+ req.session.user_id);
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

	Users.findOne({
		attributes: ['id', 'user_id', 'hashed_password'],
		where:{
			'user_id': req.body.id
		}
	}).then(function(userInstance){
		if(userInstance === null) {
			res.status(401).send("no such user");
		}else if(userInstance.hashed_password === req.body.pw){
			req.session.save(function(err){
				req.session.user_id = req.body.id;
				req.session.user = userInstance.id;
				console.log("signed in user is "+req.session.user);
				res.redirect('/main');
			});			
		}else{
			res.status(401).send("wrong password");
		}
	}).catch(function(err){
		console.log(err);
	});
});

app.post('/logout', function(req, res){
	console.log("Ever called /logout?");
	console.log(req.body.tabs);
	console.log(req.body.selected);
	// DBManager.saveLastStatus(req.session.user, req.body.tabs, req.body.selected);

	// this.userInfo[id]["lastTabs"] = tabs;
	// this.userInfo[id]["lastSelected"] = selected;
	// console.log(this.userInfo);
	// fs.writeFile('./userInfo.json', JSON.stringify(this.userInfo), function(err){
	// 	if(err) throw err;
	// 	console.log("updated lastStatus to the json file");
	// });


	// need better way of mapping events!!


	// var tabnameAndSelected = [];

	// for(var i=0;i<req.body.tabs.length;i++){
	// 	if(req.body.tabs === req.body.selected) {
	// 		tabnameAndSelected.push([req.body.tabs, true]);
	// 	}else{
	// 		tabnameAndSelected.push([req.body.tabs, false]);
	// 	}
	// }

	// for(var i=0;i<tabnameAndSelected.length;i++){
	// 	Notes.findOne({
	// 		where:{
	// 			notename: arr[0]
	// 		}
	// 	}).then(function(note){
	// 		return Lastopened.create({
	// 			note_id: note.id,
	// 			author: req.session.user,
	// 			selected: arr[1]
	// 		})
	// 	}).then(function(){
	// 		console.log("saved ")
	// 	})
	// }



	// Lastopened.create({

	// })



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

	Notes.findOrCreate({
		where:{
			'author': req.session.user,
			'notename': req.body.title
		},
		defaults: {
			'content' : req.body.content
		}
	}).spread(function(instance, created){
		console.log(created);
		console.log("Ever get to next promise?");
		console.log(instance);
		if(created === false){
			console.log("pre-existing file!");
			instance.update({
				'content': req.body.content
			}).then(function(){
				res.end();
			})
		}else{
			res.end();
		}
	})
});

app.get('/reloadFileList', function(req, res){
	console.log("got reloadFileList req?");
	console.log(req.session);
	// var fileArr = fileManager.readFileList(req.session.user);

	Notes.findAll({
		attributes: ['notename'],
		where:{
			'author': req.session.user
		}
	}).then(function(notenameArr){
		var obj = [];
		notenameArr.forEach(function(filename){
			obj.push(filename.notename);
		})
		
		console.log(obj);
		res.send(obj);
		res.end();
	})


});

app.get('/readFile', function(req, res){
	console.log(req.query.fileName);

	Notes.findOne({
		attributes: ['content'],
		where: {
			'notename': req.query.fileName,
			'author': req.session.user
		}
	}).then(function(query){
		res.send(query.content);
		res.end();
	})
})

app.get('/loadLastStatus', function(req, res){
	var obj = {};

	Lastopened.findAll({
		attributes: ['note_id', 'selected'],
		where:{
			'author': req.session.user
		}
	}).then(function(lastopenedrows){
		obj["user"] = req.session.user_id;

		var lastTabs = [];
		var lastSelectedNote;

		lastopenedrows.forEach(function(eachrow){
			lastTabs.push(eachrow.note_id);
			if(eachrow.selected === true) lastSelectedNote = eachrow.note_id;
		})

		return [lastTabs, lastSelectedNote];

	}).then(function(lastTabInfo){
		console.log("last tabs are ");
		console.log(lastTabInfo[0]);
		console.log(lastTabInfo[1]);

		var notenameGetter = function(noteid, lastSelectedNoteId){
			console.log("current note id is "+ noteid);
			console.log("current lastSelected id is "+ lastSelectedNoteId);
			return Notes.findOne({
				attributes:['note_id', 'notename'],
				where: {
					'note_id': noteid
				}
			}).then(function(eachrow){
				if(noteid === lastSelectedNoteId){
					return [eachrow.note_id, eachrow.notename, true];
				}else{
					return [eachrow.note_id, eachrow.notename, false];
				}
			});

		}

		var arr = [];
		for(var i=0;i<lastTabInfo[0].length;i++){
			arr.push(notenameGetter(lastTabInfo[0][i], lastTabInfo[1]));
		}

		return arr;

	}).then(function(ps){
		console.log("Does Promise.all works?");
		return Promise.all(ps);
	}).then(function(lastTabs){
		console.log("is last tab returned?");
		console.log(lastTabs);
		
		var fileNameArr = [];

		lastTabs.forEach(function(file){
			fileNameArr.push(file[1]);
			if(file[2] === true) obj["lastSelected"] = file[1];
		})
		obj["lastTabs"] = fileNameArr;

		res.send(obj);
		res.end();
	}).catch(function(err){
		console.log(err);
	})
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


function DBManager(){
	// this.userInfo = require('./userInfo.json');
	// console.log(this.userInfo);
}


DBManager.prototype.authenticate = function(id, pw){

	// if(this.userInfo[id] === undefined){
	// 	console.log("there's no such user");
	// 	return [false, "No such user"];
	// }else{
	// 	if(this.userInfo[id]['pw'] === pw){
	// 		console.log("yay user authenticated!");
	// 		return [true, this.userInfo[id]["lastTabs"],this.userInfo[id]["lastSelected"]];
	// 	}else{
	// 		return [false, "wrong password"];
	// 	}
	// }
}

DBManager.prototype.saveLastStatus = function(id, tabs, selected){
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

DBManager.prototype.readLastStatus = function(id){
	var obj = {};
	obj["user"] = this.userInfo[id]['id'];
	obj["lastTabs"] = this.userInfo[id]["lastTabs"];
	obj["lastSelected"] = this.userInfo[id]["lastSelected"];
	return obj;
}
