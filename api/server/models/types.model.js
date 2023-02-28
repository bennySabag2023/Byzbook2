var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var typesSchema, typesModel; 

try {
    typesSchema = new mongoose.Schema ({
        gsx$type: { 
            type: String, 
            unique : true, 
            required : true 
        }
    });

    typesSchema.plugin(uniqueValidator, 'Error, expected {PATH} to be unique.');  
    typesModel = mongoose.model('businesstypes', typesSchema);
}

catch (e) { console.log (e) }

module.exports.typesModel = typesModel;
