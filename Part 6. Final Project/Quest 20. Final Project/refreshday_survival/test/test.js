var chai = require('chai'),
	request = require('request'),
	server = require('../server').http,
	io = require('socket.io-client'),
	jwt = require('jsonwebtoken'),
	should = chai.should();

var db = require('./test_db.js'),
	insertData = require('./test_db_data.js')
	sequelize = db.sequelize,
	Activity_info = db.Activity_info,
	Activity_join_log = db.Activity_join_log,
	Chat_log = db.Chat_log;


var accesstokenQuery = "access_token=ya29.Ci95A8fdoiJ-cKMRpGOEMm6rqQ_jD6jR8rsqEUaQ29EI2bVMPjLeRj6JhKdq5xNPuQ",
	jwtkey = "random jibber jabber :P";


// describe('I - router test', function(){
// 	before(function(){
// 		server.listen(8080);
// 	});

// 	after(function(){
// 		server.close();
// 	});

// 	it("should show login.html when got / ", function(done){
// 		request({
// 			url: "http://localhost:8080",
// 			method: "GET"
// 		}, function(err, res, body){
// 			res.statusCode.should.be.equal(200);
// 			done();
// 		});

// 	});

// 	it("should generate jwt token containing user info and store jwt on cookie when provided with google access token", function(done){
// 		request({
// 			url: "http://localhost:8080/login",
// 			method: "POST",
// 			form: accesstokenQuery,
// 			followRedirect: false
// 		}, function(err, res, body){
// 			res.statusCode.should.be.equal(302);
// 			res.headers['location'].should.include('/main');
// 			res.headers['set-cookie'][0].should.contain('jwt=');
// 			done();
// 		});
// 	});

// 	describe("validating jwt", function(){
// 		var jwtCookie;

// 		before(function(done){
// 			request({
// 				url: "http://localhost:8080/login",
// 				method: "POST",
// 				form: accesstokenQuery,
// 				followRedirect: false
// 			}, function(err, res, body){
// 			// res.headers['set-cookie'] sample
// 			// [ 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IllvdW5nSW0gQW15IEpvIiwiZW1haWwiOiJ5aWpvQGtub3dyZS5jb20iLCJpYXQiOjE0NzYwNjg3ODl9.l-Tdq7skhCSIryEDvcromiYBb3WMBMuOLIH-Urtg_2o; Path=/' ]
// 				jwtCookie = res.headers['set-cookie'][0].split(';')[0];
// 				done();
// 			});	
// 		});

// 		it("should verify jwt and show user main if jwt is verified", function(done){
// 			var j = request.jar();
// 			j.setCookie(jwtCookie, "http://localhost:8080/main");
// 			request({
// 				url: "http://localhost:8080/main",
// 				method: 'GET',
// 				followRedirect: false,
// 				jar: j
// 			}, function(err, res, body){
// 				res.statusCode.should.be.equal(302);
// 				res.headers['location'].should.include('/main');
// 				done();
// 			});
// 		});

// 		it("should verify jwt and redirect user to / if jwt is failed to be verified", function(done){
// 			var j = request.jar();
// 			var cookie = "jwt=randomjibberjabber";
// 			j.setCookie(cookie, "http://localhost:8080/main");
// 			request({
// 				url: "http://localhost:8080/main",
// 				method: 'GET',
// 				followRedirect: false,
// 				jar: j
// 			}, function(err, res, body){
// 				res.statusCode.should.be.equal(302);
// 				res.headers['location'].should.include('/');
// 				done();
// 			});
// 		});
// 	});
// });


describe('II - socket test', function(){
	var jwtCookie, jar, client1;

	before(function(done){
		var userInfo = {
			username: 'Jane Doe',
			email: 'test@knowre.com',
			language: 'en'
		}
		
		jwt.sign(userInfo, jwtkey, {}, function(err, token){
			if (err) throw err;
			jwtCookie = 'jwt='+token+"&language=en";
		});

		Activity_info.sync().then(()=>{
			return Activity_info.truncate();
		}).then(()=>{
			return Activity_join_log.sync();
		}).then(()=>{
			return Activity_join_log.truncate();
		}).then(()=>{
			return insertData;
		}).then(()=>{
			done();	
		});
	});

	after(function(done){
			Activity_info.truncate({cascade: true}).then(()=>{
				return Activity_join_log.truncate();
			}).then(()=>{
				return Chat_log.truncate();
			}).then(()=>{
				done();
			})
		});


	describe("fetchActivityInfo test", function(){
		beforeEach(function(done){
			client1 = io('http://localhost:8080', {
				query: jwtCookie
			});
			done();
		});

		afterEach(function(done){
			client1.disconnect();
			done();
		});

		it("should emit receiveActivityInfo with json when got fetchActivityInfo", function(done){
			client1.on('connect', function(){
				client1.emit('fetchActivityInfo');
			});

			client1.on('receiveActivityInfo', function(activityInfo){
				for (var key in activityInfo){
					Number(key).should.be.a('number');
					activityInfo[key].should.have.all.keys('id', 'title', 'description', 'quota', 'currentQuota');
					activityInfo[key].id.should.be.a('number');
					activityInfo[key].title.should.be.a('string');
					activityInfo[key].currentQuota.should.be.a('number');
				}
				done();
			});
		});

		it("should emit joinActivity with id and username when got fetchActivityInfo", function(done){
			client1.on('connect', function(){
				client1.emit('fetchActivityInfo');
			});

			let count = 0;

			client1.on('joinActivity', function(id, username){
				count++;
				id.should.be.a('number');
				username.should.be.a('string');
			});

			let today = new Date();
			Activity_join_log.findAll({
				where: {
					created_at: {
						gt: new Date(today.getYear()+1900, today.getMonth()),
						lt: new Date(today.getYear()+1900, today.getMonth()+1)
					}
				}
			}).then((queryResult)=>{
				if(count === queryResult.length) done();
			});
		});		

	})


	describe('distinguish if activity can be joined', function(){
		beforeEach(function(done){
			client1 = io('http://localhost:8080', {
				query: jwtCookie
			});
			client1.emit('fetchActivityInfo');
			done();
		});

		afterEach(function(done){
			client1.disconnect();
			done();
		});

		it("should emit activityFull event when attempint to sign up for an full event", function(done){
			client1.on('connect', function(){
				Activity_info.findAll({
					attributes: ['id'],
					where:{
						quota: 0
					}
				}).then((queryResult)=>{
					client1.emit('applyActivity', queryResult[0].dataValues.id, "mustFail");
				});
			})

			client1.on('activityFull', function(){
				done();
			})
		})

		it("should be able to join an event when it's not full", function(done){
			let applyingActivity;

			client1.on('connect', function(){
				Activity_info.findAll({
					attributes: ['id'],
					where:{
						quota: {
							$not: 0
						}
					}
				}).then((queryResult)=>{
					applyingActivity = queryResult[0].dataValues.id;
					client1.emit('applyActivity', queryResult[0].dataValues.id, "mustPass");
				});
			});
		
			client1.on('joinActivity', function(activityNo, username){
				activityNo.should.be.equal(activityNo);
				username.should.be.equal("mustPass");
				done();
			});
		});
	});

	describe('if server can erase related info when a user leaves an activity', function(){
		let applyingActivity;

		beforeEach(function(done){
			client1 = io('http://localhost:8080', {
				query: jwtCookie
			});
			client1.emit('fetchActivityInfo');

			Activity_info.findAll({
				attributes: ['id'],
				where:{
					quota: {
						$not: 0
					}
				}
			}).then((queryResult)=>{
				applyingActivity = queryResult[0].dataValues.id;
				client1.emit('applyActivity', queryResult[0].dataValues.id, "test name for leaveActivity");
			});
			done();
		});

		afterEach(function(done){
			client1.disconnect();
			done();
		})

		it("should be able to leave activity when leaveActivity has fired", function(done){
			client1.on('connect', function(){
				client1.emit('leaveActivity', "test name for leaveActivity", applyingActivity);
			});

			client1.on('leaveActivity', function(username, activityJoined){
				username.should.be.equal("test name for leaveActivity");
				activityJoined.should.be.equal(applyingActivity);
				done();
			})
		})
	});


	describe('user should be able to join chat', function(){
		beforeEach(function(done){
			client1 = io('http://localhost:8080', {
				query: jwtCookie
			});
			client1.emit('fetchActivityInfo');
			done();
		});

		afterEach(function(done){
			client1.disconnect();
			done();
		});

		it('should emit joinchat event when detecting requestToJoinChat', function(done){
			client1.on('connect', function(){
				client1.emit('requestToJoinChat');
			});

			client1.on('joinChat', function(username){
				username.should.be.equal('Jane Doe');
				done();
			});
		})
	})



});



