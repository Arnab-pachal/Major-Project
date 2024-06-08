const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
    console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in !");
    return  res.redirect("/login");
 }
 next();
}
module.exports.savedRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.owner=async(req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing=async(req,res,next)=>{
    
        let {error}= listingSchema.validate(req.body);
         if(error){
           let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
       }
       else{next();}
    
 
}
module.exports.validateReview =(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
     if(error){
       let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }
   else{next();}

}

module.exports.author=async(req,res,next)=>{
    let {id,reviewId}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not create this review");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}