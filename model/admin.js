const mongoose=require('mongoose');
const crypto=require('crypto');
const adminSchema=new mongoose.Schema({
photo:{data:Buffer,contentType:String},
nom:{type:String,required:true},
prenom:{type:String,required:true},
login:{type:String,required:true},
hashed_pw:{type:String,required:true,unique:true}
},{timestamps:true})
adminSchema.virtual('pw')
.set(function(pw){
    this._pw=pw;
    this.hashed_pw=this.cryptPassword(pw);
})
.get(function(){
    return this._pw;
});
adminSchema.methods={
    authenticate: function(plainText){
         return this.cryptPassword(plainText)===this.hashed_pw;
        // return plainText;
    },
    cryptPassword:function(pw){
        if(!pw) return 'not found';
        try{
            return crypto.createHmac('sha1',this.nom+this.prenom)
            .update(pw)
            .digest('hex');
        }catch(err){
            return err;
        }
    }
}

module.exports=mongoose.model('Admin',adminSchema);