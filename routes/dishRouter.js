const express=require("express");
const bodyParser=require("body-parser");
const dishRouter=express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
.all((req, res, next)=>{

    res.statusCode=200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res, next)=>{
    res.end("Will send all dishes to you");
})
.post((req, res, next)=>{
    res.end("Will add the dish "+req.body.name+": "+req.body.description);
})
.put((req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete((req, res, next)=>{

    res.end("Deleting all dishes");
});

dishRouter.route("/:dishID")
.all((req, res, next)=>{

    res.statusCode=200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res, next)=>{
    res.end("Will send dish "+req.params.dishID+" to you");
})
.post((req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put((req, res, next)=>{
    res.write("Updating dish "+req.params.dishID);
    res.end("Updated dish "+req.body.name+" to "+req.body.description);
})
.delete((req, res, next)=>{

    res.end("Deleting dish "+req.params.dishID);
});

module.exports=dishRouter;