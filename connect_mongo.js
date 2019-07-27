var mongoose = require('mongoose');

var mongoDB = 'mongodb://127.0.0.1/ISDN_data';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
    console.log('Data ISDN connect successed')
});

module.exports = mongoose;