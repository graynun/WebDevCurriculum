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

const ActivityInfo = sequelize.define('ActivityInfo', {
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
	},
	activity_no: {
		type: Sequelize.INTEGER.UNSIGNED,
		field: 'activity_no',
		allowNull: false
	}
}, {
	freezeTableName: true,
	underscored: true,
	charset: 'utf8',
	timestamps: true,
	paranoid: true
});


module.exports = {
	sequelize: sequelize,
	ActivityInfo: ActivityInfo
}