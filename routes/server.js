const express = require("express");
const app = express();
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave:false,
    saveUninitialized:true,
      }));   
 app.listen(3000,()=>console.log("app is listening on 3000"));
  
 app.get("/reqcount",(req,res)=>{if(req.session.count){req.session.count++;}
else{req.session.count=1;}
res.send(`YOUR COUNT IS :- ${req.session.count}`);});