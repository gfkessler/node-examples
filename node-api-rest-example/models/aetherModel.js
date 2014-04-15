var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var aetherSchema = new Schema({
	userId: 	{ type: Number },
	comment: 	{ type: String },
	positionLat: 	{ type: Number },
	positionLng:  	{ type: Number },
	date: 		{ type: Date }
});


module.exports = mongoose.model('Aether', aetherSchema);
