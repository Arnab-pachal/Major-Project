if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
//dotenv files is used in development purpose not in production purpose
console.log(process.env.SECRET); // KEYVALUE STORED IN ENV FILES CAN BE ACCESSED BY PROCESS.ENV.KEYNAME 
//FOR THAT DOTENV NPM PACKAGE IS USED 

const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const app = express();
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const path = require("path");
const method_override= require("method-override");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter= require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
app.engine('ejs', ejsMate);
app.listen(8080,()=>{console.log("app is listening on port 8080")});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(method_override("_method"));
const ExpressError = require("./utils/ExpressError.js");
const dburl = process.env.ATLASDB_URL;

app.use(express.static(path.join(__dirname,"/public"))) ;// to use static files which is in public folder
const store = MongoStore.create(
    {
       mongoUrl:dburl,
       crypto:
       {
        secret:process.env.SECRET,
       }  
       ,
       touchAfter: 24*3600,
    }
)
store.on("error",(err)=>{console.log("error in mongo session store",err)});
const sessionOption ={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

main().then(()=>{
    console.log("mongoose have been started ");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{let err= new ExpressError(404,"Page Not Found");
    next(err);
});

//set custom expressError
app.use((err,req,res,next)=>{
    let {statusCode=500,message="SomeThing Went Wrong"}=err;
        res.status(statusCode).render("error.ejs",{err});
    })