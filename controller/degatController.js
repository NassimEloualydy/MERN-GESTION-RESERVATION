const Degat=require('../model/degat');
const Logement =require('../model/logement');
const Persone=require('../model/persone');
const Louer=require('../model/louer');
const joi=require('joi');
exports.hellow=(req,res)=>{
    return res.json({msg:"Hellow"})
}
exports.addDegat=async(req,res)=>{
const {cin,libelle,dateDegat,description,coutEstimer}=req.body;
const schema=new joi.object({
    cin:joi.string().required().pattern(/[a-zA-Z]{2}[0-9]{6}/).messages({'any.required':`SVP le cin et obligatoire !!`,'string.empty':"SVP le cin doit pas etre vide !!",'string.pattern.base':`SVP le format de cin est invalide !!`}),
    libelle:joi.string().required().messages({'any.required':`SVP le libelle de logement est obligatoire !!`,'string.empty':`SVP le libelle de logement doit pas etre vide !!`}),
    dateDegat:joi.string().required().pattern(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).messages({'any.required':`Svp la date de degate est obligatoire !!`,'string.empty':`SVP la date de degat doit pas etre vide !!`,'string.pattern.base':`SVP le format de date est invalide !!`}),
    description:joi.string().required().messages({'any.required':`SVP la description est obligatoire !!`,'string.empty':`SVP la description doit pas etre vide !!`}),
    coutEstimer:joi.string().required().pattern(/\d/).messages({'any.required':`SVP la cout estimer est obligatoire !!`,'string.empty':`SVP le cout estimer doit pas etre vide !!`,'string.pattern.base':`SVP le cout estimer doit etre un chiffre`})
})
const {error}=schema.validate(req.body);
if(error){
    return res.status(400).json({err:error.details[0].message});
}
const persone=await Persone.find({cin}).select("-photo");
if(persone.length!=1)
   return res.status(400).json({err:"SVP cet persone n'exist pas !!"});
   const logement=await Logement.find({libelle}).select("-photo");
if(logement.length!=1){
 return res.status(400).json({err:"SVP cet logement n'exist pas !!"});
}
const louer=await Louer.find().select("-photo").and([{persone:persone[0]._id},{logement:logement[0]._id}]);
if(louer.length!=1){
    return res.status(400).json({err:"SVP cette personne n'est pas loué cette maison avant ?"});
}
const d=new Degat();
d.louer=louer[0]._id;
d.dateDegat=dateDegat;
d.description=description;
d.coutEstimer=coutEstimer;
d.save((err,d)=>{
    if(err){
        return res.status(400).json({err});
    }
   return res.json({msg:"Ajouter avec sucess !!"});    
});
}
exports.getall=(req,res)=>{
    Degat.aggregate([
        {
        $lookup:{   
            from:"louers",
            localField:"louer",
            foreignField:"_id",
            as:"louerR"
        }   
        },
        {
            $lookup:{ 
                from:"persones",
                localField:"louerR.persone",
                foreignField:"_id",
                as:"personeR"
            }
        },
        {
            $lookup:{ 
                from:"logements",
                localField:"louerR.logement",
                foreignField:"_id",
                as:"logementR"
            }
        },
        {
            $project:{ 
                "_id":1,
                "dateDegat":1,
                "description":1,
                "coutEstimer":1,
                "logementR.libelle":1,
                "logementR._id":1,
                "personeR._id":1,
                "personeR.cin":1,
                "personeR.nom":1,
                "personeR.prenom":1,
            }
        }
        ]).exec((err,d)=>{
            if(err){
                return res.status(400).json({err})
            }
            return res.json({d});
        })
}
exports.deleteDegat=(req,res)=>{
      const _id=req.params.id;
      Degat.findById(_id,(err,d)=>{
        if(err){
            return res.status(400).json({err});
        }
        d.remove((err,d)=>{
            if(err){
                return res.status(400).json({err});
            }
            return res.json({msg:"Supprimer avec sucess !!"});                
        })
      });
}
exports.updateDegate= async (req,res)=>{
    const _id=req.params.id;
    const {cin,libelle,dateDegat,description,coutEstimer}=req.body;
    const schema=new joi.object({
    cin:joi.string().required().pattern(/[a-zA-Z]{2}[0-9]{6}/).messages({'any.required':`SVP le cin et obligatoire !!`,'string.empty':"SVP le cin doit pas etre vide !!",'string.pattern.base':`SVP le format de cin est invalide !!`}),
    libelle:joi.string().required().messages({'any.required':`SVP le libelle de logement est obligatoire !!`,'string.empty':`SVP le libelle de logement doit pas etre vide !!`}),
    dateDegat:joi.string().required().pattern(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).messages({'any.required':`Svp la date de degate est obligatoire !!`,'string.empty':`SVP la date de degat doit pas etre vide !!`,'string.pattern.base':`SVP le format de date est invalide !!`}),
    description:joi.string().required().messages({'any.required':`SVP la description est obligatoire !!`,'string.empty':`SVP la description doit pas etre vide !!`}),
    coutEstimer:joi.string().required().pattern(/\d/).messages({'any.required':`SVP la cout estimer est obligatoire !!`,'string.empty':`SVP le cout estimer doit pas etre vide !!`,'string.pattern.base':`SVP le cout estimer doit etre un chiffre`})
})
const {error}=schema.validate(req.body);
if(error){
    return res.status(400).json({err:error.details[0].message});
}
const persone=await Persone.find({cin}).select("-photo");
if(persone.length!=1)
   return res.status(400).json({err:"SVP cet persone n'exist pas !!"});
   const logement=await Logement.find({libelle}).select("-photo");
if(logement.length!=1){
 return res.status(400).json({err:"SVP cet logement n'exist pas !!"});
}
const louer=await Louer.find().select("-photo").and([{persone:persone[0]._id},{logement:logement[0]._id}]);
if(louer.length!=1){
    return res.status(400).json({err:"SVP cette personne n'est pas loué cette maison avant ?"});
}
const  d=await Degat.find({_id}).select();
d[0].louer=louer[0]._id;
d[0].dateDegat=dateDegat;
d[0].description=description;
d[0].coutEstimer=coutEstimer;
d[0].save((err,d)=>{
    if(err){
        return res.status(400).json({err})
    }
    return res.json({msg:"Moddifier avec success "});
})
}
exports.search=(req,res)=>{
    const {cin,
        libelle,
        dateDegatMin,
        dateDegatMax,
        description,
        coutEstimer,}=req.body;
        console.log(req.body);
    Degat.aggregate([
        {
        $lookup:{   
            from:"louers",
            localField:"louer",
            foreignField:"_id",
            as:"louerR"
        }   
        },
        {
            $lookup:{ 
                from:"persones",
                localField:"louerR.persone",
                foreignField:"_id",
                as:"personeR"
            }
        },
        {
            $lookup:{ 
                from:"logements",
                localField:"louerR.logement",
                foreignField:"_id",
                as:"logementR"
            }
        },
        {
            $project:{ 
                "_id":1,
                "dateDegat":1,
                "description":1,
                "coutEstimer":1,
                "description":1,
                "logementR.libelle":1,
                "logementR._id":1,
                "personeR._id":1,
                "personeR.cin":1,
                "personeR.nom":1,
                "personeR.prenom":1,
            }
        },{
            $match:{
                "personeR.cin":{$regex:'.*'+cin+'.*',$options:'i'},
                "logementR.libelle":{$regex:'.*'+libelle+'.*',$options:'i'},
                "dateDegat":{$gte:new Date(dateDegatMin),$lte:new Date(dateDegatMax)},
                "description":{$regex:'.*'+description+'.*',$options:'i'},
                "coutEstimer":{$regex:'.*'+coutEstimer+'.*',$options:'i'}
                            }
            
        }
        ]).exec((err,d)=>{
            if(err){
                return res.status(400).json({err})
            }
            return res.json({d});
        })
    }
    exports.lastCreate=(req,res)=>{
        Degat.aggregate([
            {
            $lookup:{   
                from:"louers",
                localField:"louer",
                foreignField:"_id",
                as:"louerR"
            }   
            },
            {
                $lookup:{ 
                    from:"persones",
                    localField:"louerR.persone",
                    foreignField:"_id",
                    as:"personeR"
                }
            },
            {
                $lookup:{ 
                    from:"logements",
                    localField:"louerR.logement",
                    foreignField:"_id",
                    as:"logementR"
                }
            },
            {
            $sort:{"createdAt":-1}                
            },
            {
                $project:{ 
                    "_id":1,
                    "dateDegat":1,
                    "description":1,
                    "coutEstimer":1,
                    "logementR.libelle":1,
                    "logementR._id":1,
                    "personeR._id":1,
                    "personeR.cin":1,
                    "personeR.nom":1,
                    "personeR.prenom":1,
                }
            }
            ]).exec((err,d)=>{
                if(err){
                    return res.status(400).json({err})
                }
                return res.json({d});
            })        
    }
    exports.lastUpdate=(req,res)=>{
        Degat.aggregate([
            {
            $lookup:{   
                from:"louers",
                localField:"louer",
                foreignField:"_id",
                as:"louerR"
            }   
            },
            {
                $lookup:{ 
                    from:"persones",
                    localField:"louerR.persone",
                    foreignField:"_id",
                    as:"personeR"
                }
            },
            {
                $lookup:{ 
                    from:"logements",
                    localField:"louerR.logement",
                    foreignField:"_id",
                    as:"logementR"
                }
            },
            {
            $sort:{"updatedAt":-1}                
            },
            {
                $project:{ 
                    "_id":1,
                    "dateDegat":1,
                    "description":1,
                    "coutEstimer":1,
                    "logementR.libelle":1,
                    "logementR._id":1,
                    "personeR._id":1,
                    "personeR.cin":1,
                    "personeR.nom":1,
                    "personeR.prenom":1,
                }
            }
            ]).exec((err,d)=>{
                if(err){
                    return res.status(400).json({err})
                }
                return res.json({d});
            })        
    }