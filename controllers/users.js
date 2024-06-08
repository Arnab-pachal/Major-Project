
const User = require("../models/user");
const multer  = require('multer');
const{storage}= require("../cloudConfig.js");
const upload = multer({storage});
module.exports.getsignupForm = (req,res)=>{res.render("user/signup.ejs")};

module.exports.postsignupForm = async(req,res)=>{
    try{
        let url=req.file.path; //here req.file is image 
        let filename = req.file.filename;
         
    let{username,email,password}=req.body;
    const newUser =new User({email,username});
    newUser.image={url,filename};
    console.log(newUser);
   const registeredUser= await User.register(newUser,password);

   req.login(registeredUser,(err)=>{
    if(err){next(err);}
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
     })
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup");
    }

};
module.exports.getloginForm = async(req,res)=>{
    res.render("user/login.ejs");
};
module.exports.postloginForm = async(req,res)=>{req.flash("success","welcome Back to wanderlust.");
let redirecturl = res.locals.redirectUrl||"/listings";
res.redirect(redirecturl);
};
module.exports.logOut = async(req,res,next)=>{
    req.logOut((err)=>{
        if(err){return next(err);}
        req.flash("success","You are LoggedOut !");
        res.redirect("/listings");
    })
}