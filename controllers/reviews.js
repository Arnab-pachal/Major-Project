const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createReview = async(req,res)=>{
    let list =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
     console.log("new review saved");
     req.flash("success","New Review Created");
     res.redirect(`/listings/${req.params.id}`);

}
module.exports.destroyReview =async(req,res)=>{
    let {id,reviewId}= req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","New Review Deleted");
   res.redirect(`/listings/${id}`);
  };