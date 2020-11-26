const mongoose=require("mongoose");
const authenticate=require("../authenticate");
const passport=require("passport");
const express=require("express");
const bodyParser=require("body-parser");
const multer=require("multer");

var storage=multer.diskStorage({

    destination: (req, file, callback)=>{ callback(null, "public/images")},
    filename: (req, file, callback)=>{ callback(null, file.originalname)}
});

var imageFileFilter=(req, file, callback)=>{

    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) return callback(new Error("Only image files"), false);
    callback(null, true);
};

var upload=multer({storage: storage, fileFilter: imageFileFilter});

var uploadRouter=express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route("/")
.get((req, res, next)=>{
    
    res.statusCode=403;
    res.end("GET operation not supported");
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single("imageFile"), (req, res, next)=>{

    res.statusCode=200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);
})
.put((req, res, next)=>{
    
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete((req, res, next)=>{
    
    res.statusCode=403;
    res.end("DELETE operation not supported");
});

module.exports=uploadRouter;