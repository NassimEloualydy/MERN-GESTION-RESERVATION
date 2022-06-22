const express=require('express');
const Router=express.Router();
const {hellow,add,getAll,getImage,deleteLogement,LogementById,UpdateLogement,search,relatedLogement,latestAdded,latestUpdated,filtreByTypeOrDesponabiliter,chart1}=require('../controller/logementController');
Router.get('/',hellow);
Router.post('/add',add);
Router.get('/all',getAll);
Router.all('/getImage/:id',getImage);
Router.post('/delete/:id',deleteLogement);
Router.post('/getLogement/:id',LogementById);
Router.post('/update/:id',UpdateLogement);
Router.post('/search',search);
Router.post('/relatedLogement',relatedLogement);
Router.post('/latestAdded',latestAdded);
Router.post('/latestUpdated',latestUpdated);
Router.post('/filtreByTypeOrDesponabiliter',filtreByTypeOrDesponabiliter);
Router.post('/chart1',chart1);
module.exports=Router
