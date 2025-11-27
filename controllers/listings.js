async function forwardGeocode(query) {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_KEY}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.features;  // array of results
}

//Require '../models/listing' to use here
const Listing = require("../models/listing");

//'INDEX' Route rendering
module.exports.index = async(req, res) => {    
    const allListings = await Listing.find({});     
    res.render("listings/index.ejs", {allListings});    
};

//'NEW' Route rendering 
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//'SHOW' Route rendering 
module.exports.showListing = async (req, res) => {     
    let {id} = req.params; 
    const listing = await Listing.findById(id)                   
        .populate({path:"reviews", populate: {path: "author"} })    
        .populate("owner");       
  
    if(!listing){   
        req.flash("error", "Listing you requested for doesn't exist!");   
        return res.redirect("/listings");    
    }
    res.render("listings/show.ejs", {listing});    
};

//'CREATE' Route redirecting 
module.exports.createListing = async(req, res, next) => {  
  
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);   
    newListing.owner = req.user._id;    
    newListing.image = {url, filename};

    let savedListing = await newListing.save();   
    console.log(savedListing);
    req.flash("success", "New Listing Created!");   
    res.redirect("/listings");  
};

//'EDIT' Route rendering 
module.exports.renderEditForm = async (req, res) => {     
    let {id} = req.params;                                                      
    const listing = await Listing.findById(id);   

    if(!listing){   
        req.flash("error", "Listing you requested for doesn't exist!");  
        return res.redirect("/listings");    
    }
    let originalImageUrl = listing.image.url;    
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");    
    res.render("listings/edit.ejs", {listing, originalImageUrl});   
};

//'UPDATE' Route redirecting
module.exports.updateListing = async (req, res) => {                                                                                    
    let {id} = req.params; 

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;    
        let filename = req.file.filename;    

        listing.image = {url, filename};  
        await listing.save();    
    }
    req.flash("success", "Listing Updated!"); 
    res.redirect(`/listings/${id}`);   
};

//'DELETE/DESTROY' Route redirecting 
module.exports.deleteListing = async (req, res) => {    
    let {id} = req.params; 

    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");   
    res.redirect("/listings");
};
