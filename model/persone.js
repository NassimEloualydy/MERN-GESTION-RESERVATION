const mongoose=require('mongoose');
const personeSchema=new mongoose.Schema({
    photo:{data:Buffer,ContentType:String},
    cin:{type:String,required:true},
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    email:{type:String,required:true},
    tel:{type:String,required:true},
    sexe:{type:String,required:true}
},{timestamps:true});
module.exports=mongoose.model("Persone",personeSchema);