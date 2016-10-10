var chai = require('chai'),
	request = require('request'),
	// chaiHttp = require('chai-http'),
	server = require('../server').http,
	io = require('socket.io-client'),
	jwt = require('jsonwebtoken'),
	should = chai.should();

var db = require('../db.js'),
	sequelize = db.sequelize,
	Activity_info = db.Activity_info,
	Activity_join_log = db.Activity_join_log,
	Chat_log = db.Chat_log;


var accesstokenQuery = "access_token=ya29.Ci94AxOSQYkUstaaEdE-WG-FEeOWd3ZvTmJ721dm-u1LrDxmjUd9C8i3gPbEuzOFvQ",
	jwtkey = "random jibber jabber :P";


// describe('router testing', function(){
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
// 				res.statusCode.should.be.equal(200);
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


describe('socket testing', function(){
	var jwtCookie, jar, client1;

	before(function(done){
		var userInfo = {
			username: 'Jane Doe',
			email: 'test@knowre.com'
		}
		
		jwt.sign(userInfo, jwtkey, {}, function(err, token){
			if (err) throw err;
			jwtCookie = 'jwt='+token;

			jar = request.jar();
			jar.setCookie(jwtCookie, 'http://localhost:8080/main');
			done();
		});
	});

	beforeEach(function(done){
		client1 = io('http://localhost:8080', {
			query: jwtCookie
		});
		done();
	});

	afterEach(function(done){
		client1.disconnect();
		done();
	})

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
				// activityInfo[key].description.should.satisfy(function(desc){
				// 	return desc == null || typeof desc == "string"
				// });
				// null이 올 수 있는 경우에는 테스트케이스를 짜지 않는것이 나은건가??
				// activityInfo[key].quota.should.satisfy(function(quo){
				// 	return quo == null || typeof quo == "number"
				// });
				activityInfo[key].currentQuota.should.be.a('number');
			}
			done();
		});
	});

	describe('distinguish if activity can be joined', function(){

		afterEach(function(done){
			var currentTime = new Date();
			var thirtyMinuteEarlier = new Date(currentTime.getTime() - 5*60*1000);
			
			Activity_join_log.destroy({
				where:{
					created_at: {
						$gt: thirtyMinuteEarlier
					}
				},
				force: true
			})
		});

		it("should emit activityFull when the quota is full", function(done){
			// 원래는 join 할 수 없는 케이스를 before에서 설정해주고 끝나면 그거 drop 하는걸 넣어줘야 하나?
			client1.on('connect', function(){
				client1.emit('applyActivity', 1, 'tester');
			});

			client1.on('activityFull', function(){
				done();
			});
		});

		it("should emit joinActivity with activityno and username when activity is able to be joined", function(done){
			client1.on('connect', function(){
				client1.emit('applyActivity', 2, 'tester');
			});

			client1.on('joinActivity', function(activityno, username){
				Number(activityno).should.be.a('number');
				username.should.be.a('string');
				done();
			})
		});
	})


});



