const Logement=require('../model/logement');
const formidable=require('formidable');
const fs=require('fs');
const joi=require('joi');
const { db } = require('../model/logement');
exports.hellow=(req,res)=>{
    return res.json("hellow"); 
}
exports.add=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
    if(err){
        return res.status(400).json({err:"image not uploaded"});
    }
    const {libelle_logment,ville_logment,adresse_logment,prix_logment,desc_logment,type_logment,desponabiliter_logment}=fields;
    const schema=new joi.object({
        libelle_logment:joi.string().required().messages({'any.required':`SVP libelle est obligatoire !!`,'string.empty': `SVP libelle est obligatoire !!`}),
        adresse_logment:joi.string().required().messages({'any.required':`SVP l'adresse est obligatoire !!`,'string.empty': `SVP l'adresse est obligatoire !!`}),
        ville_logment:joi.string().required().messages({'any.required':`SVP la ville est obligatoire !!`,'string.empty': `SVP la ville est obligatoire !!`}),
        prix_logment:joi.number().required().messages({'any.required':`SVP le prix est obligatoire !!`,'string.empty': `SVP le prix est obligatoire !!`}),
        desc_logment:joi.string().required().messages({'any.required':`SVP description est obligatoire !!`,'string.empty': `SVP description est obligatoire !!`}),
        desponabiliter_logment:joi.string().required().messages({'any.required':`SVP la desponabiliter est obligatoire !!`,'string.empty': `SVP la desponabiliter est obligatoire !!`}),
        type_logment:joi.string().required().messages({'any.required':`SVP le type est obligatoire !!`,'string.empty': `SVP le type est obligatoire !!`})   
    });
    const {error}=schema.validate(fields);
    if(error){
        return res.status(400).json({err:error.details[0].message});
    }
    let l=new Logement();
    l.libelle=libelle_logment;
    l.ville=ville_logment;
    l.adresse=adresse_logment;
    l.prix=prix_logment;
    l.description=desc_logment;
    l.desponabiliter=desponabiliter_logment;
    l.type=type_logment;
    if(files.photo_logment){
        l.photo.data=fs.readFileSync(files.photo_logment.path);
        l.photo.contentType=files.photo_logment.type; 
    }else{
        return res.status(400).json({err:"SVP l'image est obligatoire !!"});
    }
    l.save((err,L)=>{
        if(err){
            return res.status(400).json({err})
        };
        return res.json(L);
    })
});
}
exports.getAll=(req,res)=>{
    Logement.find().select("-photo").sort([['createdAt','desc']]).exec((err,logements)=>{
        if(err){
            return res.status(400).json({err});
        }
        return res.json(logements);
    })
}
exports.getImage=(req,res)=>{
    const _id=req.params.id;
    Logement.findById(_id).exec((err,l)=>{
        if(err){
            return res.status(400).json({err});
        }
       const {data,contentType}=l.photo;
       if(data){
           res.set("Content-Type",contentType);
           return res.send(data);
       }
    })
}
exports.deleteLogement=(req,res)=>{
    const id=req.params.id;
    Logement.findById(id).exec((err,logement)=>{
     if(err){
         return res.status(400).json({err});
     }
     logement.remove((err,logement)=>{
         if(err){
         return res.status(400).json({err});
         }
         return res.json({msg:"avec success"});
     })
    });
}
exports.LogementById=(req,res)=>{
    const id=req.params.id;
    Logement.findById(id).exec((err,l)=>{
        if(err){
            return res.status(400).json({err});
        }
        return res.json({l});
    })
}
exports.UpdateLogement=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
     Logement.findById(req.params.id).exec((err,l)=>{
         if(err){
            return res.status(400).json({err});
         }
     const {libelle_logment,ville_logment,adresse_logment,prix_logment,desc_logment,type_logment,desponabiliter_logment}=fields;
     l.libelle=libelle_logment;
     l.ville=ville_logment;
     l.adresse=adresse_logment;
     l.prix=prix_logment;
     l.description=desc_logment;
     l.desponabiliter=desponabiliter_logment;
     l.type=type_logment;
     if(files.photo_logment){
         l.photo.data=fs.readFileSync(files.photo_logment.path);
         l.photo.contentType=files.photo_logment.type;
     }
     l.save((err,L)=>{
         if(err){
             return res.status(400).json({err});
         }
         return res.json({msg:"Moddifier avec succes !!"});
     })
     })
    })
}
exports.search=(req,res)=>{
const {libelle_search,adresse_search,ville_search,desc_search,type_search,desponabiliter_search}=req.body;
let searchQuery={};
let min_prix_search=req.body.min_prix_search?req.body.min_prix_search:0;
let max_prix_search=req.body.max_prix_search?req.body.max_prix_search:10000000000;
console.log(min_prix_search,max_prix_search);
searchQuery.libelle={$regex:'.*'+libelle_search+'.*',$options:'i'};
searchQuery.ville={$regex:'.*'+ville_search+'.*',$options:'i'};
searchQuery.adresse={$regex:'.*'+adresse_search+'.*',$options:'i'};
searchQuery.prix={$gte:min_prix_search,$lte:max_prix_search};
searchQuery.description={$regex:'.*'+desc_search+'.*',$options:'i'};
searchQuery.desponabiliter={$regex:'.*'+desponabiliter_search+'.*',$options:'i'};
searchQuery.type={$regex:'.*'+type_search+'.*',$options:'i'};
Logement.find(searchQuery).select().exec((err,l)=>{
    if(err){
        return res.status(400).json({err});
    }
    return res.json({l});
})
}
exports.relatedLogement=(req,res)=>{
    const {ville,type,_id}=req.body;
    let searchQuery={};
    searchQuery.ville={$regex:'.*'+ville+'.*',$options:'i'};
    searchQuery.type={$regex:'.*'+type+'.*',$options:'i'};
    searchQuery._id={$ne:_id};
    Logement.find(searchQuery).select().exec((err,logements)=>{
          if(err){
              return res.status(400).json({err});
          }
          return res.json({logements});
    })
}
exports.latestAdded=(req,res)=>{
        Logement.find().select("-photo").sort([['createdAt','desc']]).limit(4).exec((err,l)=>{
        if(err){
            return res.status(400).json({err});
        }
        return res.json({l});
    })
}
exports.latestUpdated=(req,res)=>{
    Logement.find().select("-photo").sort([['updatedAt','desc']]).limit(4).exec((err,l)=>{
        if(err){
            return res.status(400).json(err);
        }
        return res.json({l});
    })
}
exports.filtreByTypeOrDesponabiliter=async(req,res)=>{
    const {value,filterBy}=req.body;
    let r=0;
    if(filterBy=="Type"){
        r=await Logement.find().select().and([{type:value}]).count();
    }else{
        r=await Logement.find().select().and([{desponabiliter:value}]).count();
    }
    return res.json(r);
}
exports.chart1=(req,res)=>{
    Logement.aggregate(
        [{
            $group:{_id:{ville:"$ville"},count:{$sum:1}}
        }]
).exec((err,l)=>{
      if(err){
          return res.status(400).json({err});
      }
      return res.json({l});
    });
}
