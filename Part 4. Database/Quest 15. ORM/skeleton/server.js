"use strict";

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	app = express(),
	db = require('./db.js'),
	sequelize = db.sequelize,
	Users = db.Users,
	Notes = db.Notes,
	Lastopened = db.Lastopened;

Users.sync();
Notes.sync();
Lastopened.sync();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(
	session({
		secret: 'change string whenvever I want to',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 3 * 60 * 1000
		}
	})
);



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
	console.log(req.body);

	var statusInfo = req.body,
		ps = [];

	//req.body[filename] = [note_id, selected]

	for (var filename in statusInfo){
		var p = Lastopened.create({
			note_id: statusInfo[filename][0],
			author: req.session.user,
			selected: statusInfo[filename][1]
		});
		ps.push(p);
	}

	Promise.all(ps).then(function(){
		console.log("Ever calls promise.all?");
		req.session.destroy(function(err){
			console.log("session destroyed?");
			if(err) throw err;
			res.redirect('/login');
		})
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
		// console.log(created);
		// console.log("Ever get to next promise?");
		// console.log(instance);
		if(created === false){
			console.log("pre-existing file!");
			instance.update({
				'content': req.body.content
			}).then(function(){
				res.send({'fileNo':instance.note_id});
				res.end();
			})
		}else{
			res.send({'fileNo':instance.note_id});
			res.end();
		}
	})
});

app.get('/reloadFileList', function(req, res){
	console.log("got reloadFileList req?");
	console.log(req.session);

	Notes.findAll({
		attributes: ['note_id','notename'],
		where:{
			'author': req.session.user
		}
	}).then(function(notenameArr){
		var obj = {};
		notenameArr.forEach(function(filename){
			obj[filename.notename] = filename.note_id;
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
		if(lastTabInfo.length === 0) res.end();
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
	}).then(function(){
		return Lastopened.destroy({
			where:{
				'author': req.session.user
			}
		});
	}).then(function(affectedRows){
		console.log("Deleted rows");
		console.log(affectedRows);
	}).catch(function(err){
		console.log(err);
	})
})


