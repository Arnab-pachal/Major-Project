const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLogin, author } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");
//Reviews 
//post route
router.post("/",isLogin,validateReview,wrapAsync(createReview))
//review delete route 
router.delete("/:reviewId",isLogin,author,wrapAsync(destroyReview));
module.exports=router;