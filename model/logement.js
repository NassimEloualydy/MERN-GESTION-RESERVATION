const mongoose=require('mongoose');
const logementSchema=new mongoose.Schema({
photo:{data:Buffer,contentType:String},
libelle:{type:String,trim:true,required:true},
ville:{type:String,trim:true,required:true},
adresse:{type:String,trim:true,required:true},
prix:{type:Number,required:true},
description:{type:String,trim:true,required:true},
desponabiliter:{type:String,trim:true,required:true},
type:{type:String,trim:true,required:true},
},{timestamps:true});
module.exports=mongoose.model('Logement',logementSchema);
