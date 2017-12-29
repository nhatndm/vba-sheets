const mongoose = require('mongoose');
const log = require('../config/log');
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUserName: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
}

exports.startDB = () => {
    mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`, {
    useMongoClient: true,
    user: dbConfig.dbUserName,
    pass: dbConfig.dbPassword,
    poolSize: 10,
  },(err) => {
    if (err) {
      log.printErr('Can not connect to DB. Please Check Again')
      return err;
    }
    log.print('Connect Successfully To DB Server');
  });
  mongoose.Promise = global.Promise;
};
