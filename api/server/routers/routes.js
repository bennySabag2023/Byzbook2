const flash = require('connect-flash');
const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
const types = require('../models/types.model.js').typesModel
const business = require('../models/businesses.model.js').businessModel;
const report = require('../models/report.model.js').reportModel;
const image = require('../models/image.model.js').imagesModel;
const message = require('../models/message.model.js').messagesModel;
const comment = require('../models/comment.model.js').commentModel;
const db = require('../../db.js');
const {fetchDataFromDB, getRandomBusiness, getCnt, getCol } = require("../controllers/controller");
const passport = require('passport');
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy;
const EventEmitter = require('events');

const {app, server} = require ("../../server");
/*var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest: './uploads/', storage: storage });*/
const cloudinary = require('cloudinary');
var config = {
  cloud_name: process.env.cloudinary_cloud_name, 
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret
}
cloudinary.config (config);

var users = [{"id":111, "username":"amy", "password":"amyspassword"}];

router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(flash())

let User = {}
User.findOne = (username, Callback) => {
     let user = {username : 'רומן'} 
     let err;
     user.verifyPassword = (password) => {
      err = (password % 2 === 0) ? null : 'Invalid password';  
      return password % 2 === 0;
     }
     Callback (err, user); 
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

passport.use('local-login', new LocalStrategy(
  function (username, password, done) {
    User.findOne (username, function (err, user) { 
      if (err) return done (null, false, {message: err})
      if (username === user.username && user.verifyPassword(password)) 
        return done(null, { username: username }, {"message": "You are now logged"});
      
      else 
        return done(null, false, {"message": "Incorrect username or password"});

    })

}))

router.use(function (req, res, next) { 
  console.log (req.body)
  if (!req.user) 
  passport.authenticate('local-login', function(err, user, info) {

    user = { username: "רומן" };
    req.login(user, loginErr => {
      console.log ("User Authenticated");
      next();
    });
  })(req, res, next);
  else next();
})

router.get('/login', function(req, res, next) {
  console.log ("user: ", req.user);
  if (req.user == undefined) return res.render('./Components/Password2');
  else return res.redirect('/');
})

/*router.post('/login', passport.authenticate("local-login", 
{
  //successReturnToOrRedirect: '/', 
  failureMessage: true,
  badRequestMessage : 'Incorrect username or password.',
  failureFlash: true,
}), 
  function(req, res, next) {
    console.log (req.user);
    res.send({ res: res.local });
  }
);*/

router.post('/login', ensureAuthenticatedLogin,
  function(req, res, next) {
    console.log (req.body)
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }

      console.log (info);
      console.log ("User:");
      console.log (user);
      if (!user) {
        return res.status (404).send ({ success: false, message : 'authentication failed' }); ///next({ success: false, message : 'authentication failed' });
      }
      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }

        if (req.body.web === 'true') return res.redirect('/'); 
        else return res.send({ success : true, message : 'authentication succeeded' });
      });
    })(req, res, next);
});
        
router.get('/logout', ensureAuthenticatedPage, function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    console.log (req.originalUrl);
    res.redirect(req.get('referer'));
    //res.status (204).send (true);
  });
})
router.post('/logout', ensureAuthenticatedLogout, function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      console.log (err);  
      return next(err); 
    }
    
    console.log (req.originalUrl);
    res.send (true);
  });
})

function ensureAuthenticatedPage(req, res, next) { 
  if (req.isAuthenticated()) { return next(); }
  else  next ({ status: 404, message: "הדף לא קיים"});
}
function ensureAuthenticatedReq(req, res, next) { 
  if (req.isAuthenticated()) { return next(); }
  else res.status(404).json({message: "אי אפשר לתת נתונים"});
}

function ensureAuthenticatedLogin (req, res, next) { 
  if (req.isAuthenticated()) next ({ status: 404, message: "הדף לא קיים"}); 
  else  return next();  
}

function ensureAuthenticatedLogout (req, res, next) { 
  if (!req.isAuthenticated()) next ({ status: 404, message: "הדף לא קיים"}); 
  else  return next();  
}

/*-------------------------------------------------------*/

router.post('/cnt', ensureAuthenticatedReq, function(req, res, next) {
  getCnt()
  .then (cnt => res.json(cnt))
  .catch (err => res.status (404).send({message: err}) );
})

/*-------------------------------------------------------*/
router.get('/businessEditor', ensureAuthenticatedPage, function(req, res, next) {
  fetchDataFromDB (req, res, next, false, async function (val, res) {
      //await business.deleteMany ({});
      return res.render("./Components/BusinessEditor", val)
  }, 0)
})
router.get('/BusinessPageEditor/:id', ensureAuthenticatedPage, function(req, res, next) {
    let id = req.params.id;
    let query = { gsx$link: id }
    business.findOne (query)
    .then(async data => {
      var myTypes = await types.find ({});
      if (data == null || types == null) next ({ status: 404, message: "הדף לא קיים"})
      else return res.render('./Components/BusinessPageEditor', { types: myTypes, business: data, user: req.user });
    })
    .catch(err => {next ({ status: 404, message: err})
    })  
});

router.get('/NewBusiness', function(req, res, next) {
  fetchDataFromDB (req, res, next, false, async function (val, res) {
    return res.render('./Components/newBusiness', val);
  })
});  

router.put('/businessUpdate', ensureAuthenticatedReq, function(req, res, next) {
  let newData = req.body.data;

  business.findOneAndUpdate ({ _id: newData._id }, newData, 
    { new: true, upsert: false })
    .then(retData => {
    console.log(retData);
    return res.send (retData);
  })
  .catch(err => res.status (404).send({message: err}))
});


router.put('/businessCreate', function(req, res, next) {

  let data = req.body.data;
  console.log (data);

  let newBusiness = new business (data);

  newBusiness.save ()
  .then(data => {
    res.send (data);
  })
  .catch(err => res.status (404).send({message: err}))
});

/*-------------------------------------------------------*/
router.get('/typesEditor', ensureAuthenticatedPage, function(req, res, next) {
  types.find ({ })
  .then(data => {
      return res.render('./Components/TypesEditor', {types: data, user: req.user});
  })
  .catch(err => next ({ status: 404, message: err}))
});

router.post('/types', ensureAuthenticatedReq, function(req, res, next) {
  types.find ({ })
  .then(data => {
      return res.json({types: data, user: req.user});
  })
  .catch(err => res.status (404).send({message: err}))
});

router.post('/addnewtype', ensureAuthenticatedReq, function(req, res, next) {
  types.create ({gsx$type: req.body.data })
  .then(data => {
    res.send (data);
  })
  .catch(err => res.status (404).send({message: err}))
});

router.put('/updatetype', ensureAuthenticatedReq, function(req, res, next) {
  types.findOneAndUpdate ({ _id: req.body.data.id }, {gsx$type: req.body.data.val})
  .then(data => {
    res.send (true);
  })
  .catch(err => res.status (404).send({message: err}))
});

router.put('/deletetype', ensureAuthenticatedReq, async function(req, res, next) {
  var businesses = await business.find ({ "gsx$type": req.body.data });
  if (businesses.length > 0) res.status(404).json (false);

  else {
    types.findOneAndDelete ({ _id: req.body.data })
    .then(data => {
      res.send (true);
    })
    .catch(err => res.status (404).send({message: err}))
  }

});

/*-------------------------------------------------------*/
router.get('/reports', ensureAuthenticatedPage, function(req, res, next) {
  report.find({}).populate('gsx$refId', ['gsx$name', 'gsx$link'])
  .exec((err, data) => {
    if (err) next ({ status: 404, message: err});
    return res.render('./Components/Reports', {reports: data, user: req.user});
  })
})


router.post('/reports', ensureAuthenticatedReq, async function(req, res, next) {
  report.find({}).populate('gsx$refId', ['gsx$name', 'gsx$link'])
  .exec((err, data) => {
    if (err) return res.status (404).send({message: err});   
    return res.json({reports: data, user: req.user});  
  })
})

router.post('/addreport', function(req, res, next) {
  console.log (req.body.data);
  let newReport = new report (req.body.data);
  newReport.save ()
  .then(data => {
    console.log (data)
    res.send (data);
  })
  .catch(err => res.status (404).send({message: err}))
});

router.put('/deletereport', ensureAuthenticatedReq, function(req, res, next) { 
  report.findOneAndDelete ({ _id: req.body.data })
  .then(data => {
    console.log (data)
    res.send (data);
  })
  .catch(err => res.status (404).send({message: err}))
});

/*-------------------------------------------------------*/
router.get('/about', async function(req, res, next) {   
  var val = { business: await getRandomBusiness(), user: req.user};
  return res.render('./Components/About', val);
})

router.post('/about', async function(req, res, next) {  
  let business1 = await getRandomBusiness();
  res.json(business1);
})

router.post('/addmessage', function(req, res, next) {
  console.log(req.body.data); 
  let newMessage = new message (req.body.data)
  newMessage.save ()
  .then(data => {
    console.log (data)
    res.send (data);
  })
  .catch(err => res.status (404).send({message: err}))
});

router.get('/contactmessages', ensureAuthenticatedPage, function(req, res, next) {
  message.find({})
  .then(data => {
    return res.render('./Components/Contactmessages', { data: data, user: req.user });
  })
  .catch(err => next ({ status: 404, message: err}))
});

router.post('/contactmessages', ensureAuthenticatedReq, function(req, res, next) {
  message.find({})
  .then(data => {
    return res.json({ data: data, user: req.user });
  })
  .catch(err => res.status (404).send({message: err}))
});

router.put('/deletemessage', ensureAuthenticatedReq, function(req, res, next) {
  message.findOneAndDelete ({ _id: req.body.data })
  .then(data => {
    console.log (data)
    res.send (data);
  })
  .catch(err => res.status (404).send({message: err}))
});


/*-------------------------------------------------------*/
router.get('/imgs', ensureAuthenticatedPage, function(req, res, next) {
  image.find ({}).populate('gsx$refID', ['gsx$name', 'gsx$link'])
  .exec((err, data) => {
    if (err) next ({ status: 404, message: e })
    else  return res.render('./Components/imgs', { data: data, user: req.user })
  })
});

router.post('/imgs', ensureAuthenticatedReq, function(req, res, next) {
  image.find ({}).populate('gsx$refID', ['gsx$name', 'gsx$link'])
  .exec((err, data) => {
    if (err) res.status (404).send({message: err})
    else  return res.json ({ data: data, user: req.user })
  })
});

/*-------------------------------------------------------*/
router.put('/comments', ensureAuthenticatedReq, function(req, res, next) {
  
  let newComment = new comment (req.body.data)
  newComment.save ()
  .then(data => {
    console.log (data)
    res.send (data);
  })
  .catch(err => res.status (404).send({message: err}))
});


router.get('/commentsAdmin', ensureAuthenticatedPage, function(req, res, next) {
  comment.find ({}).populate('gsx$refID', ['gsx$name', 'gsx$link'])
  .exec((err, data) => {
    if (err) next ({ status: 404, message: e })
    else  return res.render('./Components/CommentsAdmin', { data: data, user: req.user })
  })
});

router.post('/commentsAdmin', ensureAuthenticatedReq, function(req, res, next) {
  comment.find ({}).populate('gsx$refID', ['gsx$name', 'gsx$link'])
  .exec((err, data) => {
    if (err) res.status (404).send({message: err})
    else  return res.json({ data: data, user: req.user })
  })
});

router.put('/commentsAdmin', ensureAuthenticatedReq, async function(req, res, next) {
  
  try {
    var data = req.body.data;
    let comments = await comment.find ({});
    data = data.filter ((info, i) => comments[i].gsx$active != info.gsx$active)
    if (data.length == 0) { 
      console.log ("no need to make changes")
      return res.status (404).send({message: 'אין צורך לעשות שינויים'});
    }

    data = data.map (info => {
        let obj = { 
          updateOne: { 
            filter: { _id: info._id },
            update: { gsx$active: info.gsx$active },
            options: { upsert: true, strict: false },
          }
        }

        return obj; 
      }
    )

    console.log (data);
    comment.bulkWrite (data)
    .then(res1 => {
      console.log (res1);
      res.send (true);
    })
  }
  catch (err) {res.status (404).send({message: err})}

});

/*-------------------------------------------------------*/

router.get('/administrator', ensureAuthenticatedPage, function(req, res, next) {
  getCnt()
  .then (data => {
    return res.render('./Components/AdminPage', { cnt: data, user: req.user });
  })
  .catch (err =>   next ({ status: 404, message: "הדף לא קיים"}) );
});

/*-------------------------------------------------------*/

router.get('/', function(req, res, next) {
  fetchDataFromDB (req, res, next, true, function (val, res) {
    return res.render('./Components/HomePage', val);
  }, 0)
})

router.get('/Homepage1', function(req, res, next) {
  fetchDataFromDB (req, res, next, true, function (val, res) {
    return res.render('./Components/HomePage1', val);
  }, 0)
})

router.get('/Homepage2', function(req, res, next) {
  fetchDataFromDB (req, res, next, true, function (val, res) {
    return res.render('./Components/HomePage2', val);
  }, 0)
})

router.post('/', function(req, res, next) {
  fetchDataFromDB (req, res, next, true, function (val, res) {
    res.send (val);
  }, 1)
    
});

router.post('/getBusinessesBySearch', function(req, res, next) {
    let data = req.body.data;
    console.log (data);
    
    let query = 
    {"gsx$name": { "$regex": data.searchText, "$options": "i" }, }
    if (data.active) query["gsx$active"] = data.active
    

    if (data.city) query['gsx$city'] = data.city
    if (data.type) query['gsx$type'] = data.type

    query = {"$and": [query]}
  
    business.find (query).populate ('gsx$type')
    .exec((err, data) => {
      if (err) res.status (404).send({message: err})
      res.json (data)
    })
  });

router.get('/page/:id', function(req, res, next) {
  let id = req.params.id;
  let query = { gsx$link: id }
  business.findOne (query)
  .then(byz => {
    if (byz == null) next ({ status: 404, message: "הדף לא קיים"})
    comment.find ({gsx$refID: byz._id, gsx$active: true})
      .then(comm => {
        if (comm == null) next ({ status: 404, message: "הדף לא קיים"})
        else return res.render('./Components/Itemdata', { data: byz, comments: comm, user: req.user });
      })     
      .catch(err => next ({ status: 404, message: err}) )
  })
  .catch(err => next ({ status: 404, message: err}) )
});


/*-------------------------------------------------------*/

router.post('/a1', function(req, res, next) {
  //var fileName = req.file;
  //console.log (fileName);
  /*var data = req.body.data;
  var file = req.body.fileData
  var fileName = file.name.split ('.');
  let options = { 
    folder: "Github", 
    public_id: fileName[0],
    allowed_formats: ["gif", "png", "jpg", "bmp", "ico", "tiff", "jpc", "jp2", "webp", 
    "svg", "webm", "wdp", "hpx", "flif", "bpg"], 
    format: fileName[1], 
    resource_type: 'image', 
    invalidate: false,
  };*/

  
  cloudinary.v2.search
  .expression('resource_type:image')
  .sort_by('public_id','desc')
  //.max_results(30)
  .execute()
  .then(result=>res.send(result));

  //cloudinary.v2.search.expression('resource_type:image').then(result=>res.send(result));

  
  /*cloudinary.v2.uploader.upload (data, options, function(err, data) {
    if (err) return next ({ status: 404, message: err}) 
    return res.send (data);
  })*/
  /*console.log (options);
  res.send (data);*/
  /*business.find ({})
  .then(data => {
    if (data == null) next ({ status: 404, message: "הדף לא קיים"})
    else return res.send (data)
  })
  .catch(err => next ({ status: 404, message: err}) ) */
});

router.get('/contact', function(req, res, next) {
  return res.render('./Components/Contact', { user: req.user })
});

router.get('/Menu', function(req, res, next) {
  return res.render('./Components/Menu', { user: req.user })
});

router.get('/a1', function(req, res, next) {
  /*business.find ({})
  .then(data => {
    if (data == null) next ({ status: 404, message: "הדף לא קיים"})
    else  return res.render('./Components/a3', { data: data, config: config, user: req.user })
  })
  .catch(err => next ({ status: 404, message: err}) )*/
  getCol().then (data => { 
    console.log ("DATA:")
    return res.render('./Components/a3', { data: data, user: req.user })
  })
  .catch(err => next ({ status: 404, message: err}) )
});

/*-------------------------------------------------------*/
router.get('/*', function(req, res, next) {
  next ({ status: 404, message: "הדף לא קיים"})
})

router.post('/*', function(req, res, next) {
  console.log (req);
  //res.status (404).send({message: 'לא ניתן לקבל נתונים'})
  next ({ status: 404, message: "לא ניתן לקבל נתונים"})

})
/*-------------------------------------------------------*/



module.exports = router;
