"use strict";

var Sequelize = require('sequelize'),
	mysql = require('mysql'),
	fs = require('fs'),
	dbaccessinfo = require('./dbaccess.js');

var sequelize = new Sequelize(dbaccessinfo.dbname, dbaccessinfo.account, dbaccessinfo.password, {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle:10000
	}
});

var Users = sequelize.define('Users', {
	user_id: {
		type: Sequelize.STRING,
		field: 'user_id',
		allowNull: false,
	},
	hashed_password: {
		type: Sequelize.STRING,
		field: 'hashed_password',
		allowNull: false
	},
	nickname: {
		type: Sequelize.STRING,
	}
}, {
	freezeTableName: true,
	underscored: true,
	charset: 'utf8'
});

var Notes = sequelize.define('Notes', {
	note_id: {
		type: Sequelize.INTEGER(255).UNSIGNED,
		field: 'note_id',
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	author: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'author',
		allowNull: false
	},
	content: {
		type: Sequelize.TEXT,
		field: 'content',
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	freezeTableName: true,
	underscored: true,
	charset: 'utf8'
})

var Lastopened = sequelize.define('Lastopened', {
	note_id: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'note_id',
		allowNull: false
	},
	author: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'author',
		allowNull: false
	},
	selected: {
		type: Sequelize.BOOLEAN,
		field: 'selected',
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	freezeTableName: true,
	underscored: true,
	charset: 'utf8'
})








Users.sync({force:true}).then(function(){
	console.log("Users table created!");
	// Create pre-exsiting users into Users table

	fs.readdir('./notes', function(err, files){
		for(var i=0;i<files.length;i++){
			if(files[i] !== '.DS_Store'){
				Users.create({
					user_id: files[i],
					hashed_password: "default"
				});
			}
		}
	});
}).then(function(){
	Notes.sync({force:true}).then(function(){
		console.log("Notes table created!");
	// Create pre-existing notes into Notes table
		Users.findAll({
			attributes: ['id', 'user_id']
		}).then(function(userInfoArr){
			userInfoArr.forEach(function(user){
				fs.readdir('./notes/'+user.user_id, function(err, noteList){
					noteList.forEach(function(notename){
						if(notename !== '.DS_Store'){
							fs.readFile('./notes/'+user.user_id+'/'+notename, 'utf8', function(err, data){
								// console.log(data);
								Notes.create({
									author: user.id,
									content: data.toString()
								})
							});
						}
					})
				});
			})
		}).catch(function(error){
			console.log("oops error "+ error.message);
		});
	});
});



Lastopened.sync({force:true}).then(function(){
	console.log("Lastopened table created!");
})



