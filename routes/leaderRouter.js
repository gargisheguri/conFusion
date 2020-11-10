const express=require("express");
const bodyParser=require("body-parser");
const leaderRouter=express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route("/")
.all((req, res, next)=>{

    res.statusCode=200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res, next)=>{
    res.end("Will send all leaders");
})
.post((req, res, next)=>{
    res.end("Will add leader "+req.body.name+": "+req.body.description);
})
.put((req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete((req, res, next)=>{
    res.end("Deleting all leaders");
});

leaderRouter.route("/:leaderID")
.all((req, res, next)=>{

    res.statusCode=200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res, next)=>{
    res.end("Will send leader: "+req.params.leaderID);
})
.post((req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put((req, res, next)=>{
    res.write("Updating leader: "+req.params.leaderID);
    res.end("Updated leader "+req.body.name+" to "+req.body.description);
})
.delete((req, res, next)=>{
    res.end("Deleting leader "+req.params.leaderID);
});

module.exports=leaderRouter;