const mongoose=require('mongoose');
const noteSchema = new mongoose.schema({
    title:{
        type:String,
        required:true,
        
    },
    content:{
            type:String,
        required:true
    },
    catgoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});
module.exports=mongoose.model("Note",noteSchema);