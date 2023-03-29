const initModels = require('../../models/init-models');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: 'mysql',
		logging: false,
	}
);

const models = initModels(sequelize);

module.exports = {
	sequelize,
	models,
};
