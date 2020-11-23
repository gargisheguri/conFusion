var express = require('express');
var passport=require("passport");
const bodyParser=require("body-parser");
var User=require("../models/user");
var authenticate=require("../authenticate");
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", (req, res, next)=>{

  User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{

    if(err){

      res.stausCode=500;
      res.setHeader("Content-Type", "application/json");
      res.json({err: err});
    }

    else{

      if(req.body.firstname) user.firstname=req.body.firstname;
      if(req.body.lastname) user.lastname=req.body.lastname; 

      user.save()
      .then((user)=>{
        passport.authenticate("local")(req, res, ()=>{
          res.statusCode=200;
          res.setHeader("Content-Type", "application/json");
          res.json({success: true, status: "Registration Successful"});
        })
      })
      .catch((err)=>{
        res.stausCode=500;
        res.setHeader("Content-Type", "application/json");
        res.json({err: err});
      })
    }
  })
});

router.post("/login", passport.authenticate("local"), (req, res)=>{

  var token=authenticate.getToken({_id: req.user._id});
  res.statusCode=200;
  res.setHeader("Content-Type", "application/json");
  res.json({success: true, token: token, status: "You are logged in"});
});

router.get("/logout", (req, res, next)=>{

  if(req.user){
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  }

  else{
    err=new Error("You are not logged in");
    err.status=403;
    return next(err);
  }
});

module.exports = router;
