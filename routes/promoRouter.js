const express=require("express");
const bodyParser=require("body-parser");
const Promotions = require("../models/promotions");
const mongoose=require("mongoose");
const promoRouter=express.Router();
const authenticate=require("../authenticate");
const cors=require("./cors");

promoRouter.use(bodyParser.json());

promoRouter.route("/")
.options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200);})
.get(cors.cors, (req, res, next)=>{
    
    Promotions.find({})
    .then((promos)=>{

        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(promos);
    })
    .catch((err)=> next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Promotions.create(req.body)
    .then((promo)=>{

        console.log("Promotion created successfully");
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
    })
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Promotions.remove({})
    .then((resp)=>{

        console.log("Deleted all entries");
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
});

promoRouter.route("/:promoID")
.options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200);})
.get(cors.cors, (req, res, next)=>{
    
    Promotions.findById(req.params.promoID)
    .then((promo)=>{

        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
    })
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Promotions.findByIdAndUpdate(req.params.promoID, {$set: req.body}, {new: true})
    .then((promo)=>{

        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(promo);
    })
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Promotions.findByIdAndRemove(req.params.promoID)
    .then((resp)=>{

        console.log("Deleted entry");
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=>next(err));
});

module.exports=promoRouter;