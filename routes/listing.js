
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");
const {isLogin, owner,validateListing}=require("../middleware.js");
const { index,rendernewForm,show,create,edit,update,Delet } = require("../controllers/listings.js");
const multer  = require('multer');
const{storage}= require("../cloudConfig.js");
const upload = multer({storage});

//index route
router.route("/")
.get(wrapAsync(index))
.post(isLogin,upload.single('listing[image]'),validateListing,wrapAsync(create));

  //new route
router.get("/new",isLogin,wrapAsync(rendernewForm));
router.route("/:id") 
.get(wrapAsync(show))
.put(isLogin,owner,upload.single('listing[image]'),validateListing,wrapAsync(update))
.delete(isLogin,owner,wrapAsync(Delet));


 router.get("/:id/edit",isLogin,owner,wrapAsync(edit));

module.exports=router;