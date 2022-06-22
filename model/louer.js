const mongoose = require('mongoose');
const {ObjectId}=mongoose.Schema;
const louerSchema=new mongoose.Schema({
     persone:{type:ObjectId,ref:"Persone",required:true},
     logement:{type:ObjectId,ref:"Logement",required:true},
     dateArrive:{type:Date,required:true},
     dateSortie:{type:Date,required:true},
     dureeLocation:{type:Number,required:true},
     montantTotoale:{type:Number,required:true}
},{timestamps:true});
module.exports=mongoose.model("Louer",louerSchema);