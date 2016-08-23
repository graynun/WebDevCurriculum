"use strict";

var Sequelize = require('sequelize'),
	mysql = require('mysql');


var sequelize = new Sequelize('notepad', 'notepad_client', 'notepad_DB', {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle:10000
	}
});

var User = sequelize.define('user', {
	firstName: {
		type: Sequelize.STRING,
		field: 'first_name'
	},
	lastName: {
		type: Sequelize.STRING
	}
}, {
	freezeTableName: true
});

User.sync({force: true}).then(function(){
	return User.create({
		firstName: 'John',
		lastName: 'Hancock'
	})
});