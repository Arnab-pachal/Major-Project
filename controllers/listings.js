
const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    let allListing=await Listing.find({});
   res.render("listings/index.ejs",{allListing});
  }
module.exports.filter=async(req,res)=>{
    try {
        // Extract the `q` parameter from the URL
        const { q } = req.params;
    
        // Check if `q` is a valid string
        if (!q || typeof q !== 'string') {
          return res.status(400).send('Invalid filter query.');
        }
    
        // Find all listings where `specific` matches the filter query
        const allListing = await Listing.find({ specific: q });
    
        // Render the results to the specific.ejs template
        res.render('listings/specific.ejs', { allListing });
      } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).send('An error occurred while fetching the listings.');
      }
    
}  
module.exports.rendernewForm = async(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.show = async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing You Requested For Does Not Exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};
module.exports.create = async(req,res,next)=>{
   let url=req.file.path;
   let filename = req.file.filename;
   console.log(req.body.listing);  
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image={url,filename};
    await listing.save();
    req.flash("success","NEW LISTING CREATED");
    res.redirect("/listings");}
 module.exports.edit = async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    if(!listing){ req.flash("error","Listing You Want To Edit  Does Not Exist");
    res.redirect("/listings");}
     let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload","/upload/w_250");
      res.render("listings/edit.ejs",{listing,originalimageurl});
    
}
module.exports.update= async(req,res)=>{
   
    let {id}= req.params;
    
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect('/listings');
} 
module.exports.Delet = async(req,res)=>{
    let{id}=req.params;
    let deletedlist = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
      res.redirect('/listings');

}
module.exports.search= async(req,res)=>{
  const title = req.query.title;
  console.log(title)
  const allList = await Listing.find({
    $or: [
      { title: title },
      { country: title },
      { location: title }
    ]
  });
  
  console.log(allList);
  res.render("listings/index.ejs",{allListing:allList});

}