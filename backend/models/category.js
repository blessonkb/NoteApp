const mongoose= require("mongoose");
const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    description:{
        type: String
    },
    userId:{
        type:mongoose.Schema.type.ObjectId,
        ref:User,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});
module.exports=mongoose.model("Category",categorySchema);