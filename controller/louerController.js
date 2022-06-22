const Louer=require('../model/louer');
const Logement=require('../model/logement');
const Persone=require('../model/persone');
exports.Hellow=(req,res)=>{
    return res.json({msg:"Hellow"});
}
exports.add=async(req,res)=>{
    const {persone,logement,dateArrive,dateSortie,dureeLocation,montantTotoale}=req.body;
    const p=await Persone.find({cin:persone}).select("-photo");
    if(p.length==0){
        return res.status(400).json({err:"SVP cet person n'exist pas !!"});
    }
    const l=await Logement.find({libelle:logement}).select("-photo");
    if(l.length==0){
        return res.status(400).json({err:"SVP cet logement n'exist pas !!"});
    }
    if(l[0].desponabiliter=="Réserver"){
        return res.status(400).json({err:"SVP cet logement deja reserver !!"});
    }
    l[0].desponabiliter="Réserver";
    const idP=p[0]._id;
    const idL=l[0]._id;
    const d1 = new Date(dateArrive);
    const d2 = new Date(dateSortie);
    l[0].save((err,l)=>{
        if(err){
            return res.status(400).json({err});
        }
    });
    const louer=new Louer();
    louer.persone=idP;
    louer.logement=idL;
    louer.dateArrive=d1;
    louer.dateSortie=d2;
    louer.dureeLocation=dureeLocation;
    louer.montantTotoale=montantTotoale;
    louer.save((err,l)=>{
        if(err){
            return res.status(400).json({err});
        }
        return res.json({msg:"Ajouter avec success !!"}); 
    })
}
exports.getall=(req,res)=>{
    Louer.find().populate(
[        {
         path:"logement",
         model:"Logement",
         select:["_id","libelle","adresse"]
        },
        {
         path:"persone",
         model:"Persone",
         select:["_id","nom","prenom","cin"]            
        }
]    ).select("-photo").exec((err,l)=>{
        if(err){
            return res.status(400).json({err});
        }
        return res.json({l});
    })
}
exports.deleteLouer=(req,res)=>{
    const id=req.params.id;
    Louer.findById(id,(err,l)=>{
       if(err || !l){
        return res.status(400).json({err});
       }
       l.remove((err,l)=>{
        if(err){
            return res.status(400).json({err});
           }
           return res.json({msg:"Supprimer avec success !!"});
       })
    });
}
exports.updateLouer=async(req,res)=>{
    const _id=req.params.id;
    const {persone,logement,dateArrive,dateSortie,dureeLocation,montantTotoale}=req.body;
    let louer=await Louer.find({_id}).select("-photo");
    const p=await Persone.find({cin:persone}).select("-photo");
    if(p.length==0){
        return res.status(400).json({err:"SVP cet persone n'exist pas !!"});
    }
    let log=await Logement.find({libelle:logement}).select("-photo");
    if(log.length==0){
        return res.status(400).json({err:"SVP cet logement n'exist pas !!"});
    }
    if(log[0]._id!=louer[0].logement && louer[0].desponabiliter=="Réserver")
     return res.status(400).json({err:"SVP cet logement est deja reserver !!"});
    log[0].desponabiliter="Réserver";
    log[0].save((err,l)=>{
        if(err){
            return res.status(400).json({err});
        }
    });
    let d1=new Date(dateArrive);
    let d2=new Date(dateSortie);
    louer[0].persone=p[0]._id;
    louer[0].logement=log[0]._id;
    louer[0].dateArrive=d1;
    louer[0].dateSortie=d2;
    louer[0].dureeLocation=dureeLocation;
    louer[0].montantTotoale=montantTotoale;
    louer[0].save((err,l)=>{
       if(err){
        return res.status(400).json({err});
       }
       return res.json({msg:"Moddifier avec succee !!"});
    });
}
exports.searchLouer=(req,res)=>{
    const { persone,logement,dateArrive,dateSortie,dureeLocationMin,dureeLocationMax,montantTotoaleMin,montantTotoaleMax}=req.body;
    const searchQuery={};
    searchQuery.dateArrive={$gte:dateArrive && new Date(dateArrive)};
    searchQuery.dateSortie={$lte:dateSortie && new Date(dateSortie)};
    searchQuery.dureeLocation={$gte:dureeLocationMin==""?0:dureeLocationMin,$lte:dureeLocationMax==""?1000000:dureeLocationMax};
    searchQuery.montantTotoale={$gte:montantTotoaleMin==""?0:montantTotoaleMin,$lte:montantTotoaleMax==""?1000000:montantTotoaleMax};
    Louer.find(searchQuery)
    .populate([
        {
            path:"persone",
            model:"Persone",
            select:["_id","nom","prenom","cin"],
            match:{
                cin:{$regex:'.*'+persone+'.*',$options:"i"}
            }
        } ,
        {
            path:"logement",
            model:"Logement",
            select:["_id","libelle"],
            match:{
                libelle:{$regex:'.*'+logement+'.*',$options:"i"}
            }
        }

    ])
    .select("-photo").exec((err,l)=>{
       if(err){
        // return res.status(400).json({err});
        return  res.status(400).json({err})
    }
       return res.status(200).json({l});
    });
}
exports.lastupdate=(req,res)=>{
    Louer.find().populate([{
        path:"persone",
        model:"Persone",
        select:["_id","cin","nom","prenom"]
    },
    {
        path:"logement",
        model:"Logement",
        select:["_id","libelle"]
    }
]).select("-photo").sort([["updatedAt","desc"]]).exec((err,logements)=>{
    if(err){
        return res.status(400).json({err});
    }
    return res.json({logements});
})
}
exports.lastcreate=(req,res)=>{
    Louer.find().populate([{
        path:"persone",
        model:"Persone",
        select:["_id","cin","nom","prenom"]
    },
    {
        path:"logement",
        model:"Logement",
        select:["_id","libelle"]
    }
]).select("-photo").sort([["createdAt","desc"]]).exec((err,logements)=>{
    if(err){
        return res.status(400).json({err});
    }
    return res.json({logements});
})  
}
exports.chart1=async(req,res)=>{
    const c= await Louer.
    aggregate([
        {
        $group:{_id:{persone_info:"$persone"},count:{$sum:1}},    
    }
    ,
    {
        $lookup:{
            from:"persones",
            localField:"_id.persone_info",
            foreignField:"_id",
            as:"persone"
        }
    }

]);
return res.json({c});
// .exec((err,louer)=>{

//         if(err){
//             return res.status(400).json({err});
//         }
//         return res.json({msg:louer});
//     })
}
exports.louerParAnnee=(req,res)=>{
    const Annee=req.body.Annee;
Louer.aggregate([
        {
            $project:{
                year:{$year:"$dateArrive"}
            }
        }
        ,
{        $match:{"year":parseInt(Annee)}
}
    ]).exec((err,l)=>{
            if(err){
                return res.status(400).json({err});
            }
            return res.json({l});
        });
}
// 1 - le nombre des louer pour chaque person 
// 2 - le nombre des louer pour chaque person
// 3 - le nombre des louer pour chaque anner

