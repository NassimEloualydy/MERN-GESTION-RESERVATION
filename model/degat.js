const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;
const degatSchema=new mongoose.Schema({
    louer:{type:ObjectId,ref:"Louer",required:true},
    dateDegat:{type:Date,required:true},
    description:{type:String,required:true},
    coutEstimer:{type:String,required:true}
},{timestamps:true});
module.exports=mongoose.model('Degat',degatSchema);
