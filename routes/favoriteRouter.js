var express=require("express");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var authenticate=require("../authenticate");
const Favorites = require("../models/favorites");

var favRouter=express.Router();
favRouter.use(bodyParser.json());

favRouter.route("/")
.get(authenticate.verifyUser, (req, res, next)=>{

    Favorites.find({user: req.user._id})
    .populate("dishes")
    .populate("user")
    .then((fav)=>{
      
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(fav);    
    })
    .catch((err)=> next(err));
})
.post((req, res, next)=>{

    Favorites.findOne({user: req.user._id})
    .then((fav)=>{

        if(fav!==null){

            if(fav.dishes.length===0) fav.dishes=[];
            for(let i of req.body) fav.dishes.push(i._id);
            fav.save()
            .then((fav)=>{
                Favorites.findById(fav._id)
                .populate("dishes")
                .populate("user")
                .then((fav)=>{

                    res.statusCode=200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(fav);
                })
                .catch((err)=> next(err));
            })
            .catch((err)=> next(err));
        }
        else{

            var favObj=new Favorites({user: req.user._id});
            for(let i of req.body) favObj.dishes.push(i);
            Favorites.create(favObj)
            .then((fav)=>{
                Favorites.findById(fav._id)
                .populate("dishes")
                .populate("user")
                .then((fav)=>{
                    res.statusCode=200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(fav);
                })
                .catch((err)=> next(err));
            })
            .catch((err)=> next(err));
        }
    })
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser, (req, res, next)=>{

    res.statusCode=403;
    res.setHeader("Content-Type", "text/html");
    res.end("PUT operation not supported");
})
.delete(authenticate.verifyUser, (req, res, next)=>{

    Favorites.findOneAndRemove({user: req.user._id})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=> next(err));
});

favRouter.route("/:dishID")
.get(authenticate.verifyUser, (req, res, next)=>{

    res.statusCode=403;
    res.setHeader("Content-Type", "text/html");
    res.end("GET operation not supported");
})
.post(authenticate.verifyUser, (req, res, next)=>{

    Favorites.findOne({user: req.user._id})
    .then((fav)=>{

        if(fav!==null && fav.dishes.indexOf(req.params.dishID)===-1){

            if(fav.dishes.length===0) fav.dishes=[];
            fav.dishes.push(req.params.dishID);
            fav.save()
            .then((fav)=>{
                Favorites.findById(fav._id)
                .populate("dishes")
                .populate("user")
                .then((fav)=>{
                    res.statusCode=200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(fav);
                })
                .catch((err)=> next(err));
            })
            .catch((err)=> next(err));
        }
        else if(fav===null){

            var favObj=new Favorites({user: req.user._id});
            favObj.dishes.push(req.params.dishID);
            Favorites.create(favObj)
            .then((fav)=>{
                Favorites.findById(fav._id)
                .populate("dishes")
                .populate("user")
                .then((fav)=>{
                    res.statusCode=200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(fav);
                })
                .catch((err)=> next(err));
            })
            .catch((err)=> next(err));
        }
        else{
            res.statusCode=200;
            res.setHeader("Content-Type", "text/html");
            res.end("Dish already added to favorites");
        }
    })
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser, (req, res, next)=>{

    res.statusCode=403;
    res.setHeader("Content-Type", "text/html");
    res.end("PUT operation not supported");
})
.delete(authenticate.verifyUser, (req, res, next)=>{

    Favorites.findOne({user: req.user._id})
    .then((fav)=>{

        if(fav!=null){
            if(fav.dishes.indexOf(req.params.dishID)!=-1){
                fav.dishes.splice(req.params.dishID,1);
                fav.save()
                .then((fav)=>{

                    Favorites.findById(fav._id)
                    .populate("dishes")
                    .then((fav)=>{
                        res.statusCode=200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(fav.dishes);
                    })
                    .catch((err)=> next(err));
                })
                .catch((err)=> next(err));
            }
            else{
                err=new Error("Dish not found");
                err.statusCode=404;
                return next(err);
            }
        }
        else{
            err=new Error("User profile not found");
            err.statusCode=404;
            return next(err);
        }
    })
    .catch((err)=> next(err));
})


module.exports=favRouter;