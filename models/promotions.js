const mongoose=require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Currency=mongoose.Types.Currency;

const Schema=mongoose.Schema;

const promoSchema=new Schema({

    name:{
        type: String,
        required: true, 
        unique: true
    },

    image:{
        type: String,
        required: true
    },

    label:{
        type: String,
        default: ""
    },

    price:{
        type: Currency,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    featured:{
        type: Boolean,
        default: false
    }
});

const Promotions=mongoose.model('Promotion', promoSchema);
module.exports=Promotions;