"use strict";

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	scrypt = require("scrypt"),
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
	console.log(req.body.pw);

	var user;
	
	Users.findOne({
			attributes: ['id', 'account_id', 'hashed_password'],
			where:{
				'account_id': req.body.id
			}
	}).then(function(userInstance){
		if(userInstance === null) {
			res.status(401).send("no such user");
			return new Error("no such user");
		}else{
			user = userInstance.id;
		}

		var param = scrypt.paramsSync(0.2);
		
		return scrypt.verifyKdf(new Buffer(userInstance.hashed_password, 'hex'), req.body.pw);

	}).then(function(result){
		console.log(result);

		if(result === true){
			req.session.save(function(err){
				req.session.user_id = req.body.id;
				req.session.user = user;
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
		console.log("note_id is "+statusInfo[filename][0]);
		console.log("user_id is "+req.session.user);
		console.log("selected "+statusInfo[filename][1]);
		var p = Lastopened.create({
			note_id: statusInfo[filename][0],
			user_id: req.session.user,
			selected: statusInfo[filename][1]
		});
		ps.push(p);
	}

	//junction table 어떻게 설계하는 것이 좋은가...(I/O가 자주있는 지금 디자인 이대로 괜찮은가...)
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
			'user_id': req.session.user,
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
			console.log(instance.note_id);
			instance.update({
				'content': req.body.content
			}).then(function(){
				res.send({'fileNo':instance.id});
				res.end();
			})
		}else{
			res.send({'fileNo':instance.id});
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
			'user_id': req.session.user
		}
	}).then(function(notenameArr){
		var obj = {};
		notenameArr.forEach(function(filename){
			// console.log(filename.dataValues);
			// console.log(filename.notename);
			//console.log(filename.note_id);	이거 안먹는데 이유를 모르겠음
			//filename.notename은 되는데 filename.note_id는 안됨...????
			obj[filename.notename] = filename.dataValues.note_id;
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
			'user_id': req.session.user
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
			'user_id': req.session.user
		}
	}).then(function(lastopenedrows){
		obj["user"] = req.session.user_id;

		var lastTabs = [];
		var lastSelectedNote;

		lastopenedrows.forEach(function(eachrow){
			lastTabs.push(eachrow.note_id);
			if(eachrow.selected === true) lastSelectedNote = eachrow.note_id;
		})

		obj["lastTabs"] = lastTabs;
		obj["lastSelected"] = lastSelectedNote;

		console.log(obj);

		res.send(obj);
		res.end();		

	}).then(function(){
		return Lastopened.destroy({
			where:{
				'user_id': req.session.user
			}
		});
	}).then(function(affectedRows){
		console.log("Deleted rows");
		console.log(affectedRows);
	}).catch(function(err){
		console.log(err);
	})
})


