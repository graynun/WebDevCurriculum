"use strict";

var Human = function(firstName, lastName) {
	this.firstName = firstName;
	this.lastName = lastName;
}

class Man extends Human{
	constructor(firstName, lastName){
		super(firstName, lastName);
		this.gender = "male";
	}

	get name(){
		return this.firstName + " " + this.lastName;
	}

}

 Man.prototype.sayName = function() {
		console.log("Hi, my name is "+this.name);
 }
//  


// function Human(first, last){
// 	this.firstName = first;
// 	this.lastName = last;
// }

// function Man(first, last){
// 	Human.call(this, first, last);
// 	this.gender = "male";
// }

// Man.prototype = new Human();
// // Man.prototype = Object.create(Human.prototype);


var hans = new Man("Hans", "Gimmerman");