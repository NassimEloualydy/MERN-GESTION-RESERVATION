const express =require('express');
const mongoose=require('mongoose');
const expressValidator=require('express-validator');
const adminRouter=require('./routes/admin');
const logementRouter=require('./routes/logement');
const personRouter=require('./routes/persone');
const louerRouter=require('./routes/louer');
const degatRouter=require('./routes/degat');
const cors=require('cors');
const app=express();
const cookieParser=require('cookie-parser');
require('dotenv').config();
const PORT=process.env.PORT || 8000;
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("connenct")).catch((err)=>console.log(err));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(expressValidator());
//les routes
app.use('/API/admin',adminRouter);
app.use('/API/logement',logementRouter);
app.use('/API/persone',personRouter);
app.use('/API/louer',louerRouter);
app.use('/API/degat',degatRouter);
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})
