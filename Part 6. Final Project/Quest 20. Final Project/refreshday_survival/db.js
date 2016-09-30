const Sequelize = require('sequelize'),
	dbaccessinfo = {
		name: "refreshday",
		account: "refreshday_client",
		password: "refreshday_survival"
	};

const sequelize = new Sequelize(dbaccessinfo.name, dbaccessinfo.account, dbaccessinfo.password, {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});


const Activity_info = sequelize.define('Activity_info', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'id',
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING,
		field: 'title',
		allowNull: false
	},
	description :{
		type: Sequelize.TEXT,
		field: 'description',
		allowNull: true
	},
	available_date: {
		type: Sequelize.DATEONLY,
		field: 'avaliable_date',
		allowNull: true
	}
}, {
	freezeTableName: true,
	underscored: true,
	charset: 'utf8',
	timestamps: true,
	paranoid: true
})

const Activity_join_log = sequelize.define('Activity_join_log', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'id',
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	username: {
		type: Sequelize.STRING,
		field: 'username',
		allowNull: false
	}
	// ,
	// activity_no: {
	// 	type: Sequelize.INTEGER.UNSIGNED,
	// 	field: 'activity_no',
	// 	allowNull: false
	// }
}, {
	freezeTableName: true,
	underscored: true,
	charset: 'utf8',
	timestamps: true,
	paranoid: true
});

const Chat_log = sequelize.define('Chat_log', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'id',
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	chat_day: {
		type: Sequelize.STRING,
		field: 'chat_day',
		allowNull: false
	},
	username: {
		type: Sequelize.STRING,
		field: 'username',
		allowNull: false
	},
	chat_message: {
		type: Sequelize.TEXT,
		field: 'chat_message',
		allowNull: false
	}
}, {
	freezeTableName: true,
	underscored: true,
	charset: 'utf8',
	timestamps: true,
	paranoid: true
});

Activity_info.hasMany(Activity_join_log, {
	foreignKey: {
		name: 'activity_id'
	}
});


module.exports = {
	sequelize: sequelize,
	Activity_info: Activity_info,
	Activity_join_log: Activity_join_log,
	Chat_log: Chat_log
}