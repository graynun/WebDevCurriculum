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
	id: {
		type: Sequelize.INTEGER(255).UNSIGNED,
		field: 'id',
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	account_id: {
		type: Sequelize.STRING,
		field: 'account_id',
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
	id: {
		type: Sequelize.INTEGER(255).UNSIGNED,
		field: 'note_id',
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	// author: {
	// 	type: Sequelize.INTEGER.UNSIGNED,
	// 	allowNull: false
	// },
	notename: {
		type: Sequelize.STRING,
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
	id: {
		type: Sequelize.INTEGER(255).UNSIGNED,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	// note_id: {
	// 	type: Sequelize.INTEGER.UNSIGNED,
	// 	field: 'note_id',
	// 	allowNull: false
	// },
	// user_id: {
	// 	type: Sequelize.INTEGER.UNSIGNED,
	// 	field: 'user_id',
	// 	allowNull: false
	// },
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



Users.hasMany(Notes, {as: 'author'});

Users.belongsToMany(Notes, {as:'author', through: 'Lastopened'});
Notes.belongsToMany(Users, {through: 'Lastopened'});
// Users.belongsToMany(Notes, {as: 'author', through: 'Lastopened', foreignKey: 'user_id'});
// Notes.belongsToMany(Users, {through: 'Lastopened'});




Users.sync({force:true}).then(function(){
// Users.sync().then(function(){
	console.log("Users table created!");
	// Create pre-exsiting users into Users table
	return new Promise(function(resolve, reject){
		fs.readdir('./notes', function(err, files){
			if(err !== null) return reject(err);
			resolve(files);
		});
	});

}).then(function(files){
	for(var i=0;i<files.length;i++){
		if(files[i] !== '.DS_Store'){
			Users.create({
				account_id: files[i],
				hashed_password: "default"
			});
		}
	}

	// return Notes.sync();
	return Notes.sync({force:true});

}).then(function(){
	// Notes.sync({force:true}).then(function(){
	console.log("Notes table created!");
	// creating lastopened;
	// return Lastopened.sync();
	return Lastopened.sync({force:true});
}).then(function(){
	console.log("Lastopened table created!");
	return Users.findAll({
		attributes: ['id', 'account_id']
	});

	// Create pre-existing notes into Notes table
}).then(function(userInfoArr){
	userInfoArr.forEach(function(user){
		// console.log("user id is "+user.id);
		fs.readdir('./notes/'+user.account_id, function(err, noteList){
			if(err !== null) throw err;
			noteList.forEach(function(notename){
				if(notename !== '.DS_Store'){
					fs.readFile('./notes/'+user.account_id+'/'+notename, 'utf8', function(err, data){
						console.log(user.id);
						Notes.create({
							user_id: user.id,
							notename: notename.split(/\.txt/)[0],
							content: data.toString()
						})
					});
				}
			});
		});
	});
}).catch(function(error){
		console.log("oops error "+ error.message);
});



// Lastopened.sync({force:true}).then(function(){





