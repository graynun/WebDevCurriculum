var chai = require('chai'),
	chaiHttp = require('chai-http'),
	server = require('../server'),
	should = chai.should();

chai.use(chaiHttp);

describe('router testing', function(){
	it("should show login.html when got / ");
	it("should verify jwt token");
	it("should verify google oauth access token");
	it("should ")

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