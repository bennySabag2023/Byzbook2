var mongoose = require('mongoose');
require('mongoose-type-url');
var uniqueValidator = require('mongoose-unique-validator');
var { isEmail, isURL, isFQDN } = require('validator');
var validate = require('mongoose-validator');

var businessSchema, businessModel;

/*var urlValidator = validate({
    validator: 'isURL',
    passIfEmpty: false,
    message: 'string value is not valid URL',
})*/
  
var isValidAndNullableEmail = (str, options) => {
    if (!str) return true;
    else return isEmail(str, options);
}

var isValidAndNullableURL = (str) => {
    if (!str) return true;
    else return isURL(str, options) && isFQDN(str, options);
}


try {
		
    businessSchema = new mongoose.Schema ({
        gsx$type: { type: mongoose.ObjectId, ref: 'businesstypes', required: true},
        gsx$name: { type: String, unique: true, required: true},
        gsx$logo: { type: String, unique: true, required: true },
        gsx$logoheight: { type: Number, min: 200, max: 500, required: true},
        gsx$logowidth: { type: Number, min: 200, max: 500, required: true},
        gsx$address: { type: String, required: false, default: null },
        gsx$addressGeolocation: { type: [{ type: Number }], default: [null, null] }, 
        gsx$city: { type: String, required: true },
        gsx$phone: { type: [{ type: String }], default: [null, null, null] },
        gsx$whatsapp: { type: String, default: null },
        gsx$email: { type: String, validate: [ isValidAndNullableEmail, 'invalid email' ], 
        required: false, default: null },
        gsx$facebook: { type: mongoose.SchemaTypes.Url, default: null },
        gsx$instagram: { type: mongoose.SchemaTypes.Url, default: null },
        gsx$website: { type: mongoose.SchemaTypes.Url, default: null },
        gsx$comment: { type: String, default: null },
        gsx$worktime: { type: [{ type: String }], default: [null, null, null] },
        gsx$desc: { type: String, required: false  },   
        gsx$tags: { type: [{ type: String }], required: false },
        gsx$link: { type: String, required: true, unique: true },
        gsx$active: { type: Boolean, required: true }
    });
    
    businessSchema.plugin(uniqueValidator, 'Error, expected {PATH} to be unique.');     
    businessModel = mongoose.model ("business", businessSchema);

}
catch (e) { console.log (e) }

module.exports.businessModel = businessModel;