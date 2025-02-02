const express=require("express");
const bodyParser=require("body-parser");
const Leaders = require("../models/leaders");
const mongoose=require("mongoose");
const leaderRouter=express.Router();
const authenticate=require("../authenticate");
const cors=require("./cors");

leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
.options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200);})
.get(cors.cors, (req, res, next)=>{
    
    Leaders.find({})
    .then((leaders)=>{

        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(leaders);
    })
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Leaders.create(req.body)
    .then((leader)=>{

        console.log("Creating new leader");
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
    })
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Leaders.remove({})
    .then((resp)=>{

        console.log("Deleted all entries successfully");
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=>next(err));
});

leaderRouter.route("/:leaderID")
.options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200);})
.get(cors.cors, (req, res, next)=>{
    
    Leaders.findById(req.params.leaderID)
    .then((leader)=>{

        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
    })
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Leaders.findByIdAndUpdate(req.params.leaderID, {$set: req.body}, {new: true})
    .then((leader)=>{

        console.log("Updated entry");
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
    })
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    
    Leaders.findByIdAndRemove(req.params.leaderID)
    .then((resp)=>{

        console.log("Deleted entry");
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=>next(err));
});

module.exports=leaderRouter;