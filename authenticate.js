var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
var User=require("./models/user");
var jwtStrategy=require("passport-jwt").Strategy;
var jwt=require("jsonwebtoken");
var extractJwt=require("passport-jwt").ExtractJwt;
var config=require("./config");

//module.exports=
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=(user)=>{

    return jwt.sign(user, config.secret, {expiresIn: 3600});
};

var opts={};
opts.secretOrKey=config.secret;
opts.jwtFromRequest=extractJwt.fromAuthHeaderAsBearerToken();

exports.jwtPassport=passport.use(new jwtStrategy(opts, (payload, done)=>{

    console.log("JWT Payload: ", payload);
    User.findOne({_id: payload._id})
    .then((user, err)=>{

        if(err) return done(err, false);
        else if(user) return done(null, user);
        else return done(null, false);
    });
}));

exports.verifyUser=passport.authenticate("jwt", {session: false});