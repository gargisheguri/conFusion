const express=require("express");
const bodyParser=require("body-parser");
const promoRouter=express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route("/")
.all((req, res, next)=>{

    res.statusCode=200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res, next)=>{
    res.end("Will send all promotions");
})
.post((req, res, next)=>{
    res.end("Will add promotion "+req.body.name+": "+req.body.description);
})
.put((req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete((req, res, next)=>{
    res.end("Deleting all promotions");
});

promoRouter.route("/:promoID")
.all((req, res, next)=>{

    res.statusCode=200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res, next)=>{
    res.end("Will send promotion: "+req.params.promoID);
})
.post((req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put((req, res, next)=>{
    res.write("Updating promotion: "+req.params.promoID);
    res.end("Updated promotion "+req.body.name+" to "+req.body.description);
})
.delete((req, res, next)=>{
    res.end("Deleting promotion "+req.params.promoID);
});

module.exports=promoRouter;