const express=require("express");
const bodyParser=require("body-parser");
const dishRouter=express.Router();
const mongoose=require("mongoose");
const authenticate=require("../authenticate");

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
.post(authenticate.verifyUser, (req, res, next)=>{
    
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("Dish successfully created", dish);
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    })
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete(authenticate.verifyUser, (req, res, next)=>{

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
.post(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put(authenticate.verifyUser, (req, res, next)=>{
    
    Dishes.findByIdAndUpdate(req.params.dishID, {$set: req.body}, {new: true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    })
    .catch((err)=> next(err));
})
.delete(authenticate.verifyUser, (req, res, next)=>{

    Dishes.findByIdAndRemove(req.params.dishID)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=> next(err));
});

dishRouter.route("/:dishID/comments")
.get((req, res, next)=>{
    
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null){
            res.statusCode=200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
        }
        else{
            err=new Error("Dish not found");
            err.statusCode=404;
            return next(err);
        }
    })
    .catch((err)=> next(err));
})
.post(authenticate.verifyUser, (req, res, next)=>{
    
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null){

            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish.comments);
            })
            .catch((err)=> next(err));
        }
        else{
            var err=new Error("Dish not found");
            err.statusCode=404;
            return next(err);
        }
    })
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403;
    res.end("PUT operation not supported");
})
.delete(authenticate.verifyUser, (req, res, next)=>{

    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null){

            for(var i=dish.comments.length-1;i>=0;i--) 
            dish.comments.id(dish.comments[i]._id).remove();

            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            })
            .catch((err)=> next(err));
        }
        else{
            var err=new Error("Dish not found");
            err.statusCode=404;
            return next(err);
        }
    })
    .catch((err)=> next(err));
});

dishRouter.route("/:dishID/comments/:commentID")
.get((req, res, next)=>{
    
    Dishes.findById(req.params.dishID)
    .then((dish)=>{

        if(dish!=null && dish.comments.id(req.params.commentID)!=null){
            res.statusCode=200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentID));
        }
        else{
            if(dish!=null){
                err=new Error("Comment does not exist");
                err.statusCode=404;
                return next(err);
            }

            else{
                err=new Error("Dish does not exist");
                err.statusCode=404;
                return next(err);
            }
        }
    })
    .catch((err)=> next(err));
})
.post(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode=403;
    res.end("POST operation not supported");
})
.put(authenticate.verifyUser, (req, res, next)=>{
    
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentID)!=null){

            if(req.body.rating) 
            dish.comments.id(req.params.commentID).rating=req.body.rating;

            if(req.body.comment) 
            dish.comments.id(req.params.commentID).comment=req.body.comment;

            dish.save()
            .then((dish)=>{

                res.statusCode=200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish.comments.id(req.params.commentID));
            })
            .catch((err)=> next(err));
        }

        else if(dish!=null){

            err=new Error("Comment not found");
            err.statusCode=404;
            return next(err);
        }

        else{

            err=new Error("Dish not found");
            err.statusCode=404;
            return next(err);
        }
    })
    .catch((err)=> next(err));
})
.delete(authenticate.verifyUser, (req, res, next)=>{

    Dishes.findById(req.params.dishID)
    .then((dish)=>{
    
        if(dish!=null && dish.comments.id(req.params.commentID)!=null){

            dish.comments.id(req.params.commentID).remove();

            dish.save()
            .then((dish)=>{

                res.statusCode=200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish.comments);
            })
            .catch((err)=> next(err));
        }

        else if(dish!=null){

            err=new Error("Comment not found");
            err.statusCode=404;
            return next(err);
        }

        else{

            err=new Error("Dish not found");
            err.statusCode=404;
            return next(err);
        }
    })
    .catch((err)=> next(err));
});

module.exports=dishRouter;