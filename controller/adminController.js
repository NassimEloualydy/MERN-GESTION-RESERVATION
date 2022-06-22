const Admin=require('../model/admin');
const jwt=require('jsonwebtoken');
const formidable=require('formidable');
const joi=require('joi');
const fs=require('fs');

require('dotenv').config();
exports.hellow=(req,res)=>{
    return res.json({msg:"hellow"});
}
exports.connexion= async (req,res)=>{
  const {login_cnx,password_cnx}=req.body;
//   var count= await Admin.find().select("-photo").and([{login:login_cnx},{pw:password_cnx}]).count();
  Admin.findOne({login:login_cnx},(err,a)=>{
    if(err || !a){
        return res.status(400).json({err:"SVP le login est untrouvable !"});
    }
    if(!a.authenticate(password_cnx)){
        return res.status(400).json({err:"SVP le mot de passe est untrouvable !!"});
    }
    admin=a;
    const token=jwt.sign({_id:a._id},process.env.JWT_SECRETE);
    res.cookie('token',token,{expire:new Date+800000000000});
    const {_id,nom,prenom}=a;
    return res.json({token,admin:{_id,nom,prenom}});
  });
  req.admin=req.body;
}

exports.inscription=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.KeepExtensions=true;
    form.parse(req, async (err,fields,files)=>{
        const {nom,prenom,login,pw}=fields;
        const schema=new joi.object({
            nom:joi.string().required().messages({'any.required':`SVP le nom est obligatoire !!`}),
            prenom:joi.string().required().messages({'any.required':`SVP le prenom est obligatoire !!`}),
            login:joi.string().required().messages({'any.required':`SVP le login est obligatoire !!`}),
            pw:joi.string().required().messages({'any.required':`SVP le mot de passe est obligatoire !!`})
        });
        const {error}=schema.validate(fields);
        if(error){
            return res.status(400).json({err:error.details[0].message});
        }
       var c=await Admin.find().and([{nom},{prenom}]).count();
       if(c!=0){
           return res.status(400).json({err:"SVP le nom et le prenom exist deja !!"});
       }
    c=await Admin.find({login:{$eq:login}}).select().count();
    if(c!=0){
        return res.status(400).json({err:"SVP le login exist deja !!"});
    }
       if(err){
           return res.status(400).json({err:"SVP l'image est obligatoire !"});
       }
       let admin=new Admin(fields);
       if(files.photo){
         admin.photo.data=fs.readFileSync(files.photo.path);
         admin.photo.contentType=files.photo.type;                
       }
       admin.save((err,a)=>{
           if(err){
                return res.status(400).json({err:"SVP le mot de passe exit deja essayer un autre !!"});
            }
           res.json({a});
       })
    })
}
exports.Quitter=(req,res)=>{
    res.clearCookie('token');
    res.json({message:"Admin quitter !!"});
}
 exports.showPhotoAdmin=(req,res)=>{
     const _id=req.params.id;
     Admin.findById(_id).exec((err,a)=>{
         if(err ||!a){
             return res.status(400).json({err});
         }
         const {data,contentType}=a.photo;
         if(data){

             res.set('Content-Type',contentType)
             return res.send(data);
            }
     })
 }
 exports.getAdmin=(req,res)=>{
    const {_id}=req.body;
    Admin.findOne({_id},(err,a)=>{
    if(err){
        return res.status(400).json({err});
    }
    return res.json({a});
    })
 }
 exports.updateAdmin=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.KeepExtensions=true;
    form.parse(req, async (err,fields,files)=>{
     const {nom,prenom,login,pw}=fields;
     const _id=req.params.id;
     var c=await Admin.find().select("-photo").and([{_id:{$ne:_id}},{nom},{prenom}]);
     if(c!=0){
        return res.status(400).json({err:"le nom et le prenom exist deja !!"});
     }
      c=await Admin.find().select("-photo").and([{_id:{$ne:_id}},{login}]);
     if(c!=0){
        return res.status(400).json({err:"le login exist deja !!"});
     }
     Admin.findOne({_id},(err,a)=>{
      if(err){
        return res.status(400).json({err});
      }
      a.nom=nom;
      a.prenom=prenom;
      a.login=login;
      if(pw!="")
      a.pw=pw;
      if(files.photo){
        a.photo.data=fs.readFileSync(files.photo.path);
        a.photo.contentType=a.photo.type;
      }
      a.save((err,a)=>{

        if(err){
            return res.status(400).json({err:"SVP le mot de passe exit deja essayer un autre !!"});
        }
        const token=jwt.sign({_id:a._id},process.env.JWT_SECRETE);
        res.cookie('token',token,{expire:new Date+800000000000});
        const {_id,nom,prenom}=a;
        return res.json({token,admin:{_id,nom,prenom}});
          })
     })
    })
 }