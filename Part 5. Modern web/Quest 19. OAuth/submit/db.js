var mysql = require('mysql'),
	Sequelize = require('sequelize'),
	dbaccessinfo = require('./dbaccess.js');

var sequelize = new Sequelize(dbaccessinfo.dbname, dbaccessinfo.account, dbaccessinfo.password, {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
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
	},
	email: {
		type: Sequelize.STRING,
		field: 'email',
		allowNull: false,
	},
	hashed_password: {
		type: Sequelize.STRING,
		field: 'hashed_password'
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



Users.hasMany(Notes);

Users.belongsToMany(Notes, {
	through: {
		model:'Lastopened',
		unique: false
	}
});
Notes.belongsToMany(Users, {
	through: {
		model:'Lastopened',
		unique: false
	}
});

module.exports = {
	sequelize: sequelize,
	Users: Users,
	Notes: Notes,
	Lastopened: Lastopened
};
