const express=require('express');
const Router=express.Router();
const {Hellow,add,getall,deleteLouer,updateLouer,searchLouer,lastupdate,lastcreate,chart1,louerParAnnee}=require('../controller/louerController');
Router.get('/hellow',Hellow);
Router.post('/add',add);
Router.get('/getall',getall);
Router.delete('/delete/:id',deleteLouer);
Router.post('/update/:id',updateLouer);
Router.post('/search',searchLouer);
Router.get('/lastupdate',lastupdate);
Router.get('/lastcreate',lastcreate);
Router.get('/chart1',chart1);
Router.post('/louerParAnnee',louerParAnnee)
module.exports=Router;
