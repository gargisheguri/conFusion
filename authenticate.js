var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
var User=require("./models/user");
var jwtStrategy=require("passport-jwt").Strategy;
var jwt=require("jsonwebtoken");
var extractJwt=require("passport-jwt").ExtractJwt;
var config=require("./config");
var FacebookTokenStrategy=require("passport-facebook-token");

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

exports.verifyAdmin=(req, res, next)=>{

    if(req.user.admin==false){
        err=new Error("You are not an admin");
        err.status=403;
        next(err);
    }

    else next();
};

exports.facebookPassport=passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret
},
(accessToken, verifyToken, profile, done)=>{

    User.findOne({facebookID: profile.id}, (err, user)=>{

        if(err) return done(err, false);
        else if(user!==null) return done(null, user);
        else{

            user=new User({
                username: profile.displayName,
                facebookID: profile.id,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName
            });

            user.save((err, user)=>{

                if(err) return done(err, false);
                return done(null, user);
            });
        }
    });
}
));