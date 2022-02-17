const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.Host,
    dialect: dbConfig.dialect,
    dialectOptions: {
        // useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true,
        timezone: "-05:00"
      },
    timezone: "-05:00", //for writing to database 
    operatorAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user_model")(sequelize, Sequelize);
db.images = require("./image_model")(sequelize, Sequelize);

module.exports = db;