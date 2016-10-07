var chai = require('chai'),
	request = require('request'),
	// chaiHttp = require('chai-http'),
	server = require('../server'),
	jwt = require('jsonwebtoken'),
	should = chai.should();

var jwtCookie;

describe('router testing', function(){

	before(function(){
		server.listen(8080);
	})

	after(function(){
		server.close();
	})

	it("should show login.html when got / ", function(done){
		request({
			url: "http://localhost:8080",
			method: "GET"
		}, function(err, res, body){
			res.statusCode.should.be.equal(200);
			done();
		});

	});

	it("should generate jwt token containing user info and store jwt on cookie when provided with google access token", function(done){
		request({
			url: "http://localhost:8080/login",
			method: "POST",
			form: "access_token=ya29.Ci91AwFzaTvlHNh1E5JoFTsCCRhZMGJ1BDC2thKjeF2psNk1FjV-HSnoLy2Iq_PgOQ",
			jar: true,
			followRedirect: false
		}, function(err, res, body){
			res.statusCode.should.be.equal(302);
			res.headers['location'].should.include('/main');
			res.headers['set-cookie'][0].should.contain('jwt=');
			jwtCookie = res.headers['set-cookie'][0].split(';')[0];
			console.log(jwtCookie);
			// generatedjwt = res.headers['set-cookie'][0].split(/';'|'='/g)[1];
			done();
		});

	});

	it("should verify jwt and show user main if jwt is verified", function(done){
		request.cookie = jwtCookie;
		request({
			url: "http://localhost:8080/main",
			method: 'GET',
			followRedirect: false
		}, function(err, res, body){
			res.statusCode.should.be.equal(200);
			done();
		})
	});
});

// var assert = require('assert');
// var expected, current;


// before(function(){
// 	expected = ['a','b','c'];
// })






// describe('String#split', function(){

// 	beforeEach(function(){
// 		current = 'a,b,c'.split(',');
// 	})


	
// 	it('should return an array', function(){
	
// 		assert(Array.isArray(current));
	
// 	});

// 	it('should return the same array', function(){
	
// 		assert.equal(expected.length, current.length, "arrays have equal length");

// 		for(var i=0;i<expected.length;i++){
// 			assert.equal(expected[i], current[i], i+"element is equal");
// 		}
// 	});

// })