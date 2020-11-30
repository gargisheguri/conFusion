var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var favSchema=new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
    }]
}, 
{timestamps: true});

var Favorites=mongoose.model("Favorite", favSchema);
module.exports=Favorites;