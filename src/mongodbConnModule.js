var mongoose = require('mongoose');

module.exports.connect = function() {
    var url = process.env.MONGOLAB_URI;
	mongoose.connect(url);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function(callback){
	  console.log("Connection Succeeded");
	});
	return db;
}
