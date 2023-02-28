//DataBase file

var mongoose = require('mongoose');
const dbConnectionString = "mongodb+srv://romanbr87:qazqaz12@walla.co.il@cluster0.gaih6.mongodb.net/BusinessIndex?retryWrites=true&w=majority";

mongoose.set('debug', true);
mongoose.Promise = Promise;

let options = { 
  useNewUrlParser : true, 
  autoIndex : true, 
  promiseLibrary : global.Promise, 
  useUnifiedTopology: true
};

mongoose.connect(dbConnectionString, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, ''));

db.once('open',function () {
    console.log('\ndatabase connected. Ready state: ', db.readyState);    
}).on('error',function (error) {
	console.log("Ready state: " + db.readyState);	
    console.log('CONNECTION ERROR:',error);
});

module.exports.db = db;
module.exports.collections = db.collections;
module.exports.collection = db.collection;