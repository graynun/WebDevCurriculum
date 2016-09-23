"use strict";

const googleClientID = "660527717768-3od23s46fpgd339laq3rsdpef0bb9bnc.apps.googleusercontent.com";

const express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	scrypt = require("scrypt"),
	https = require("https"),
	app = express(),
	db = require('./db.js'),
	sequelize = db.sequelize,
	Users = db.Users,
	Notes = db.Notes,
	Lastopened = db.Lastopened;

Users.sync().then((users)=> {
	return Notes.sync();
}).then((notes)=>{
	return Lastopened.sync();
}).then((lastopened)=>{
	console.log("************************************SUCCESSFULLY CREATED TABLES*************************");
});

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(
	session({
		secret: 'Notepad system revised agian with Google Login',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 3 * 60 * 1000
		}
	})
);

app.use('/', function(req, res, next){
	console.log("current user_id is "+ req.session.user_id);
	console.log("app.use request sessionID is "+req.sessionID);
	next();
});

app.get('/', (req, res)=>{
	res.sendFile(path.join(__dirname, '/client/login.html'));
})

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

	Users.findOrCreate({
		where: {
			'account_id': req.body.id 
		}
	}).spread((user, created)=>{
		console.log("created? "+created);
		if(created === true){
			return scrypt.params(0.2).then((param)=>{
				return scrypt.kdf(req.body.pw, param);
			}).then((hashedresult)=>{
				user.set('hashed_password', hashedresult.toString('hex'));
				return true;
			});
			// let newpassword = scrypt.kdfSync(req.body.pw, param);
			// console.log(newpassword);
			// console.log(newpassword.toString('hex'));
			// user.set('hashed_password', newpassword);
			// return true;
		}else{
			let userpassword = users.get('hashed_password');
			console.log(userpassword);
			return scrypt.verifyKdf(new Buffer(user.get().hashed_password, 'hex'), req.body.pw);
		}
		console.log("userinfo " + user.get());

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




	
	// Users.findOne({
	// 		attributes: ['id', 'account_id', 'hashed_password'],
	// 		where:{
	// 			'account_id': req.body.id
	// 		}
	// }).then(function(userInstance){
	// 	if(userInstance === null) {
	// 		res.status(401).send("no such user");
	// 		return new Error("no such user");
	// 	}else{
	// 		user = userInstance.id;
	// 	}


		
	// 	return scrypt.verifyKdf(new Buffer(userInstance.hashed_password, 'hex'), req.body.pw);

	// }).then(function(result){
	// 	console.log(result);

	// 	if(result === true){
	// 		req.session.save(function(err){
	// 			req.session.user_id = req.body.id;
	// 			req.session.user = user;
	// 			console.log("signed in user is "+req.session.user);
	// 			res.redirect('/main');
	// 		});
	// 	}else{
	// 		res.status(401).send("wrong password");
	// 	}
	// }).catch(function(err){
	// 	console.log(err);
	// });
});


app.post('/loginWithGoogle', (req, res)=> {
	console.log("received login request with google oauth");
	console.log(req.body);
	console.log(req.body.access_token);

//https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=

	let options = {
		hostname: 'www.googleapis.com',
		port: 443,
		method: 'GET',
		path: '/oauth2/v3/tokeninfo?access_token='+req.body.access_token
	}

	let tokenreq = https.request(options, (tokenres)=>{
		let response;

		tokenres.on('data', (chunk) =>{
			console.log(chunk.toString());
			response = JSON.parse(chunk.toString());
		})

		tokenres.on('end', ()=>{
			console.log("end of token validation response with user email");
			console.log(response.email);

			//https://www.googleapis.com/oauth2/v2/userinfo?access_token=

			if(response.aud === googleClientID){
				let pinfooptions = {
					hostname: 'www.googleapis.com',
					port: 443,
					method: 'GET',
					path: '/oauth2/v2/userinfo?access_token='+req.body.access_token
				}

				let personalInfoReq = https.request(pinfooptions, (pres)=>{
					let userinfo;

					pres.on('data', (chunk)=>{
						userinfo = JSON.parse(chunk.toString());
					})

					pres.on('end', ()=>{
						console.log("collected personal info from google");
						console.log(userinfo);

						Users.findOrCreate({
							where: {email: response.email},
							defaults: {nickname: userinfo.name}
						}).spread((user, created)=>{
							console.log("created? "+created);
							console.log("userinfo " + user.get());
							req.session.save(function(err){
								req.session.user_id = userinfo.name;
								req.session.user = user.get().id;
								console.log("signed in user is "+req.session.user_id);
								res.redirect('/main');
							});
						}).catch((err)=>{
							if(err) throw err;
						});

					})
				});
				personalInfoReq.end();
			}
		})

	})

	tokenreq.end();
})


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
		}).then(()=>{
			console.log("Saved a lastopened row");
		});
		ps.push(p);
	}

	Promise.all(ps).then(function(){
		console.log("Successfully saved lastopened info.");
		req.session.destroy(function(err){
			console.log("session destroyed");
			if(err) throw err;
			res.redirect('/');
		})
	}).catch((err)=> {
		if(err) throw err;
	})
});


app.get('/main', function (req, res) {
	console.log("got /main get");
	res.sendFile(path.join(__dirname, '/client/main.html'));
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
		var userNoteInfo = {};
		notenameArr.forEach(function(filename){
			userNoteInfo[filename.notename] = filename.dataValues.note_id;
		})
		
		console.log(userNoteInfo);
		res.send(userNoteInfo);
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


