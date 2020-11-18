const express=require("express");
const bodyParser=require("body-parser");
const dishRouter=express.Router();
const mongoose=require("mongoose");

const Dishes=require("../models/dishes");

dishRouter.use(bodyParser.json());

dishRouter.route("/")
.get((req, res, next)=>{
    
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes);
    })
    .catch((err)=> next(err));
})
.post((req, res, next)=>{
    
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("Dish successfully created", dish);
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    })
    .catch((err)=> next(err));
})
.put((req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete((req, res, next)=>{

    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=> next(err));
});

dishRouter.route("/:dishID")
.get((req, res, next)=>{
    
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    })
    .catch((err)=> next(err));
})
.post((req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put((req, res, next)=>{
    
    Dishes.findByIdAndUpdate(req.params.dishID, {$set: req.body}, {new: true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    })
    .catch((err)=> next(err));
})
.delete((req, res, next)=>{

    Dishes.findByIdAndRemove(req.params.dishID)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=> next(err));
});

module.exports=dishRouter;