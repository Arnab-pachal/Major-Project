const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const { getsignupForm, postsignupForm, getloginForm, postloginForm, logOut } = require("../controllers/users.js");
const {index}= require("../controllers/listings.js");
const multer  = require('multer');
const{storage}= require("../cloudConfig.js");
const upload = multer({storage});
router.get("/",wrapAsync(index))
router.get("/signup",wrapAsync(getsignupForm));
router.post("/signup",upload.single('image'),wrapAsync(postsignupForm));
router.get("/login",wrapAsync(getloginForm));
router.post("/login",savedRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true})
,wrapAsync(postloginForm));
router.get("/logout",logOut)

module.exports= router;