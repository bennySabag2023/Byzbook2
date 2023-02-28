var mongoose = require('mongoose');
require('mongoose-type-url');
var uniqueValidator = require('mongoose-unique-validator');
var { isEmail, isURL, isFQDN } = require('validator');
var validate = require('mongoose-validator');

var imagesSchema, imagesModel;

try {
		
    imagesSchema = new mongoose.Schema ({
        gsx$refID: { type: mongoose.ObjectId, ref: 'business', required: true },
        gsx$logo: { type: String, unique: true, required: true },
        gsx$logoheight: { type: Number, min: 200, max: 500, required: true },
        gsx$logowidth: { type: Number, min: 200, max: 500, required: true },
    });
    
    imagesModel = mongoose.model ("images", imagesSchema);

}
catch (e) { console.log (e) }

module.exports.imagesModel = imagesModel;