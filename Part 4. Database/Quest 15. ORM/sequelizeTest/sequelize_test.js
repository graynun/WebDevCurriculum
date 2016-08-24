"use strict";

var Sequelize = require('sequelize'),
	mysql = require('mysql'),
	dbaccessinfo = require('./dbaccess.js');

console.log(dbaccessinfo.dbname);
console.log(dbaccessinfo.account);
console.log(dbaccessinfo.password);

// var sequelize = new Sequelize('notepad', 'notepad_client', 'notepad_DB', {
// 	host: 'localhost',
// 	dialect: 'mysql',
// 	pool: {
// 		max: 5,
// 		min: 0,
// 		idle:10000
// 	}
// });

// var User = sequelize.define('Users', {
// 	user_id: {
// 		type: Sequelize.STRING,
// 		field: 'user_id',
// 		allowNull: false,
// 	},
// 	hashed_password: {
// 		type: Sequelize.STRING,
// 		field: 'hashed_password',
// 		allowNull: false
// 	},
// 	nickname: {
// 		type: Sequelize.STRING,
// 	}
// }, {
// 	freezeTableName: true
// });

// var Notes = sequelize.define('Notes', {
// 	note_id: {
// 		type: Sequelize.INTENGER.UNSIGNED,
// 		field: 'note_id',
// 		allowNull: false,
// 		autoIncrement: true,
// 		primaryKey: true
// 	}
// 	author: {
// 		type: Sequelize.INTEGER.UNSIGNED,
// 		field: 'author',
// 		allowNull: false,
// 		references: {
// 			model: 'Users',
// 			key: 'id'
// 		}
// 	},
// 	content: {
// 		type: Sequelize.TEXT,
// 		field: 'content',
// 		allowNull: false
// 	}
// })




// User.sync({force: true}).then(function(){
// 	return User.create({
// 		firstName: 'John',
// 		lastName: 'Hancock'
// 	});
// }).then(function(){
// 	return User.create({
// 		firstName: 'Jane',
// 		lastName: 'Doe'
// 	});
// }).then(function(){
// 	return User.create({
// 		firstName: 'John',
// 		lastName: 'Hancock'
// 	});
// }).catch(function(error){
// 	console.log("oops error"+ error.message);
// });