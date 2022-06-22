const Persone=require('../model/persone');
const joi=require('joi');
const fs=require('fs');
const formidable=require('formidable');
const { body } = require('express-validator/check');
exports.Hello=(req,res)=>{
    return res.json({msg:'hellow'});
}
exports.add=(req,res)=>{
const form=new formidable.IncomingForm();
form.keepExtensions=true;
form.parse(req,async(err,fields,files)=>{
    const schema=new joi.object({
        cin:joi.string().required().pattern(/[a-zA-Z]{2}[0-9]{6}/).messages({'any.required':`SVP cni est obligatoire !!`,'string.empty': `SVP cni est obligatoire !!`,'string.pattern.base':`SVP format est invalide !!`}),
        nom:joi.string().required().messages({'any.required':`SVP Nom est obligatoire !!`,'string.empty': `SVP Nom est obligatoire !!`}),
        prenom:joi.string().required().messages({'any.required':`SVP Prenom est obligatoire !!`,'string.empty': `SVP Prenom est obligatoire !!`}),
        tel:joi.string().required().pattern(/0[0-9]{9}/).messages({'any.required':`SVP Telephone est obligatoire !!`,'string.empty': `SVP Telephone est obligatoire !!`,'string.pattern.base':`SVP format est invalide !!`}),
        email:joi.string().required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).messages({'any.required':`SVP email est obligatoire !!`,'string.empty': `SVP email est obligatoire !!`,'string.pattern.base':`SVP format est invalide !!`}),
        sexe:joi.string().required().messages({'any.required':`SVP Sexe est obligatoire !!`,'string.empty': `SVP Sexe est obligatoire !!`})       
    });
    const {error}=schema.validate(fields);
    if(error){
        return res.status(400).json({err:error.details[0].message});
    }
    if(!files.photo){
        return res.status(400).json({err:"SVP l'image est obligatoire !!"})
    }    
    const {cin,nom,prenom,email,tel,sexe}=fields;
    var c=await Persone.find({cin}).select("-photo").count();
    if(c!=0){
        return res.status(200).json({err:"SVP cin exit deja !!"});
    }
    c=await Persone.find().select("-photo").and([{nom},{prenom}]).count();
    if(c!=0){
        return res.status(200).json({err:"SVP le nom et le prenom exit deja !!"});
    }
    c=await Persone.find({tel}).select("-photo").count();
    if(c!=0){
        return res.status(200).json({err:"SVP le telephone exit deja !!"});
    }
    c=await Persone.find({email}).select("-photo").count();
    if(c!=0){
        return res.status(200).json({err:"SVP le email exist deja"});
    }
      
    let P=new Persone({cin,nom,prenom,email,tel,sexe});
    if(files.photo){
        P.photo.data=fs.readFileSync(files.photo.path);
        P.photo.contentType=files.photo.type;
    }
    P.save((err,person)=>{
        if(err){
            return res.status(400).json({err});
        }
        return res.json({msg:"Ajouter avec success !!"});
    })

});
}
exports.getall=(req,res)=>{
    Persone.find().select("-photo").sort([["createdAt","desc"]]).exec((err,P)=>{
        if(err){
            return res.status(400).json({err})
        }
        return res.json({P});
    })
}
exports.getImage=(req,res)=>{
    const _id=req.params.id;
    Persone.findById(_id).exec((err,p)=>{
        if(err){
            return res.status(400).json({err});
        }
        const {data,contentType}=p.photo;
        if(data){
            res.set("Content-Type",contentType);
        }
        return res.send(data);
    });
}
exports.deletePersone=(req,res)=>{
    const id=req.params.id;
    Persone.findById(id,(err,p)=>{
        if(err){
            return res.status(400).json({err});
        }
        p.remove((err,p)=>{
            if(err){
                return res.status(400).json({err});
            }
            return res.json({msg:"Suppromer avec sucess"});
        })
    })
}
exports.updatePerson=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req, async (err,fields,files)=>{
        const schema=new joi.object({
            cin:joi.string().required().pattern(/[a-zA-Z]{2}[0-9]{6}/).messages({'any.required':`SVP cni est obligatoire !!`,'string.empty': `SVP cni est obligatoire !!`,'string.pattern.base':`SVP format est invalide !!`}),
            nom:joi.string().required().messages({'any.required':`SVP Nom est obligatoire !!`,'string.empty': `SVP Nom est obligatoire !!`}),
            prenom:joi.string().required().messages({'any.required':`SVP Prenom est obligatoire !!`,'string.empty': `SVP Prenom est obligatoire !!`}),
            tel:joi.string().required().pattern(/0[0-9]{9}/).messages({'any.required':`SVP Telephone est obligatoire !!`,'string.empty': `SVP Telephone est obligatoire !!`,'string.pattern.base':`SVP format est invalide !!`}),
            email:joi.string().required().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).messages({'any.required':`SVP email est obligatoire !!`,'string.empty': `SVP email est obligatoire !!`,'string.pattern.base':`SVP format est invalide !!`}),
            sexe:joi.string().required().messages({'any.required':`SVP Sexe est obligatoire !!`,'string.empty': `SVP Sexe est obligatoire !!`})       
        });
        const {error}=schema.validate(fields);
        if(error){
            return res.status(400).json({err:error.details[0].message});
        }
       const {cin,nom,prenom,tel,sexe,email}=fields;
       const _id=req.params.id;
       var c=await Persone.find().select("-photo").and([{_id:{$ne:_id}},{cin}]).count();
       if(c!=0){
           return res.status(200).json({err:"SVP cin exit deja !!"});
       }
       c=await Persone.find().select("-photo").and([{nom},{prenom},{_id:{$ne:_id}}]).count();
       if(c!=0){
           return res.status(200).json({err:"SVP le nom et le prenom exit deja !!"});
       }
       c=await Persone.find().select("-photo").and([{_id:{$ne:_id}},{tel}]).count();
       if(c!=0){
           return res.status(200).json({err:"SVP le telephone exit deja !!"});
       }
       c=await Persone.find().select("-photo").and([{_id:{$ne:_id}},{email}]).count();
       if(c!=0){
           return res.status(200).json({err:"SVP le email exist deja"});
       }
       let p=await Persone.find({_id}).select();
       p[0].cin=cin;
       p[0].nom=nom;
       p[0].prenom=prenom;
       p[0].tel=tel;
       p[0].email=email;
       p[0].sexe=sexe;
       if(files.photo){
         p[0].photo.data=fs.readFileSync(files.photo.path);
         p[0].photo.contentType=files.photo.type;
       }
       p[0].save((err,p)=>{
         if(err){
            return res.status(400).json({err});
         }
         return res.json({msg:"Moddifier avec succes !!"});
       })
    }) 
}
exports.search=(req,res)=>{
    const {cin,nom,prenom,tel,email,sexe}=req.body;
    let searchQuery={};
     searchQuery.cin={$regex:'.*'+cin+'.*',$options:'i'};
    searchQuery.nom={$regex:'.*'+nom+'.*',$options:'i'};
    searchQuery.prenom={$regex:'.*'+prenom+'.*',$options:'i'};
    searchQuery.tel={$regex:'.*'+tel+'.*',$options:'i'};
    searchQuery.email={$regex:'.*'+email+'.*',$options:'i'};
    searchQuery.sexe={$regex:'.*'+sexe+'.*',$options:'i'};
    Persone.find(searchQuery).select("-photo").exec((err,p)=>{
        if(err){
         return res.status(400).json(err);
        }
        return res.json(p);
    })
}
exports.latestUpdate=(req,res)=>{
    Persone.find().select("-photo").sort([["updatedAt","desc"]]).exec((err,p)=>{
        if(err){
            return res.status(400).json(err);
        }
        return res.json({p});
    })
}
exports.latestCreate=(req,res)=>{
    Persone.find().select("-photo").sort([["createdAt","desc"]]).exec((err,p)=>{
        if(err){
            return res.status(400).json(err);
        }
        return res.json({p});
    })
    
}