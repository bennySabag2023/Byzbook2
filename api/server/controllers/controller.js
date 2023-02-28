const types = require('../models/types.model.js').typesModel
const business = require('../models/businesses.model.js').businessModel;
const report = require('../models/report.model.js').reportModel;
const image = require('../models/image.model.js').imageModel;
const message = require('../models/message.model.js').messagesModel;
const comment = require('../models/comment.model.js').commentModel;
const db = require ('../../db.js');

  module.exports.fetchDataFromDB = async (req, res, next, isActivatable, callback, errFunc) => {  
    
    let query = isActivatable ? {gsx$active : true} : {}
    
    try {
      let val = { };
      val.businesses = await business.find (query);
      val.types = await types.find ({});
      val.user = req.user;
      return callback (val, res);
    }
    catch (err) {
      if (errFunc = 1) return res.status(404).json(err);
      else return next({ status: 404, message: err })
    }
  }

  module.exports.getRandomBusiness = async () => {
    var cnt = await business.count();
    var n = Math.floor(Math.random() * cnt);  
    var rndbusiness = await business.findOne ().skip(n);
    console.log (rndbusiness);
    return rndbusiness;
  }

  module.exports.getCnt = async () => {
    var models = Object.values(db.db.models)
    
    var counts = await Promise.all(models.map (async model => {
      var modelName = model.collection.collectionName;
      var cnt = await model.collection.countDocuments();
      var obj = {[modelName]: cnt};
      console.log (obj);
      return obj
    }))

    counts = Object.assign({}, ...counts);
    return counts;
  }
    
  module.exports.getCol = async () => {
    var models = Object.values(db.db.models)
    
    var cols = await Promise.all(models.map (async model => {
      var modelName = model.collection.collectionName;
      var col = await model.find({});
      var obj = {[modelName]: col};
      console.log (obj);
      return obj
    }))

    cols = Object.assign({}, ...cols);
    return cols;
  }
    
  /*function fetchDataFromDB (req, res, next, callback) {
  var userAgent = req.headers['user-agent'];     // user-agent header from an HTTP request
  var arr = [Business, types]
  return Promise.all(
    arr.map(table =>
      table.find ({})
      .then (types => types)
      .catch (err => err)
    ))
    .then((value) => {
      let val = { };
      val.businesses = value[0];
      val.types = value[1];
      val.ua = userAgent;
      return callback (val, res);
      //return res.json (val);
    })
    .catch((err) => {
      var error = { }
      error.err1 = err[0];
      error.err2 = err[1];
      //return res.status(404).json(error);
      return next(error)
    })
}*/

module.exports.ip = (res) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
