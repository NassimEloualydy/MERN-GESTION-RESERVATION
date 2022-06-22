const Admin=require('../model/admin');
exports.AdminCnx=(req,res,next)=>{
    req.admin=req.body;
    console.log(req.admin);
    next();
}