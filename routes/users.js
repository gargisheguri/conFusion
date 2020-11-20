var express = require('express');
const bodyParser=require("body-parser");
var User=require("../models/user");

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup", (req, res, next)=>{

  User.findOne({username: req.body.username})
  .then((user)=>{

    if(user!=null){
      err=new Error("This username is already taken");
      err.status=403;
      return next(err);
    }

    else{
      return User.create({username: req.body.username, password: req.body.password});
    }
  })
  .then((user)=>{
    res.statusCode=200;
    res.setHeader("Content-Type", "application/json");
    res.json({status: "Registration successful", user: user});
  })
  .catch((err)=> next(err));
});

router.post("/login", (req, res, next)=>{

  console.log(req.session);

  if(!req.session.user){

    var authHeader=req.headers.authorization;

    if(!authHeader){
      err=new Error("You are not authenticated");
      err.status=401;
      res.setHeader("WWW-Authenticate", "Basic");
      return next(err);
    }

    var auth=new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");

    var username=auth[0];
    var password=auth[1];

    User.findOne({username: username})
    .then((user)=>{

      if(user===null){
        err=new Error("User does not exist");
        err.status=403;
        return next(err);
      }

      else if(user.password!==password){
        err=new Error("Incorrect password");
        err.status=403;
        return next(err);
      }

      else{
        req.session.user="Authenticated";
        res.statusCode=200;
        res.setHeader("Content-Type", "text/plain");
        res.end("You are authenticated");
      }
    })
    .catch((err)=> next(err));
  }

  else{

    res.statusCode=200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are logged in already");
  }
});

router.get("/logout", (req, res)=>{

  if(req.session){
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
