const fs = require('fs');
const rdsCa = fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem');

module.exports = {
HOST : "localhost",
USER: "postgres",
PASSWORD: "Kdabiru@2023",
DB: "user_db",
dialect: "postgres",
pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
},
dialectOptions: {
    useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true,
    ssl: {
        rejectUnauthorized: true,
        ca: [rdsCa]
    }
},
timezone: '-05:00'
}