//58. Here, we are designing 'Controller' from 'MVC'(Model View Controller) & export it. To make 'routes/listing.js' file ROUTES look clean

async function forwardGeocode(query) {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_KEY}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.features;  // array of results
}


//Require '../models/listing' to use here
const Listing = require("../models/listing");

//58(A). 'INDEX' Route rendering (moved from 'routes/listing.js' here)
module.exports.index = async(req, res) => {    
    const allListings = await Listing.find({});     //printing all listing places of data.js file & store in var listings
    res.render("listings/index.ejs", {allListings});     //sending/rendering listing places to dir 'listings/index.ejs' file 
};

//58(B). 'NEW' Route rendering (moved from 'routes/listing.js' here)
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//58(B). 'SHOW' Route rendering (moved from 'routes/listing.js' here)
module.exports.showListing = async (req, res) => {     
    let {id} = req.params; 
    const listing = await Listing.findById(id)                   //find the listing places(data.js) by _id & store in var listing
        .populate({path:"reviews", populate: {path: "author"} })    //populate reviews & author to show them on specific review 
        .populate("owner");       //.populate("owner") to show all reviews along with its owner array data stored in that specific listing place
    
    //55(K). If specific listing not avail., & user wanna see it then this flash error msg will display 
    if(!listing){   
        req.flash("error", "Listing you requested for doesn't exist!");   //55(K). 'name : value' pair used in flash, in which after a specific listing not found(exist), a flash error msg shows "Listing you requested for doesn't exist!"
        return res.redirect("/listings");    //after flash msg, redirect to main /listings page
    }
    //console.log(listing);
    res.render("listings/show.ejs", {listing});    //sending/rendering this specific find _id to show.ejs file
};

//58(B). 'CREATE' Route redirecting (moved from 'routes/listing.js' here)
module.exports.createListing = async(req, res, next) => {  
    
    // forward geocoding: searching for a place
    // let response = await geocodingClient.forwardGeocode({
    //     query: req.body.listing.location,  // place name to search
    //     limit: 1                 // max number of results
    // })
    // .send();
    
    // const features = await forwardGeocode(req.body.listing.location);
    // console.log(features); // array of geocoding results

    //from req.file only select 'url' & 'filename' of the img uploaded, to store in MongoDB 
    //Add uploaded image to DB
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);   //req.body.listing contains all your fields: title: , description: , price: , etc(creating new listing using Listing model & req.body data from form)
    newListing.owner = req.user._id;    //store _id of specific current listing user(req.user) to new listing owner 
    newListing.image = {url, filename};

    let savedListing = await newListing.save();    //newListing is a Mongoose model, .save() to store new listing in this model structure to DB
    console.log(savedListing);
    req.flash("success", "New Listing Created!");   //55(I). 'name : value' pair used in flash, in which after a new listing created a flash msg shows "New Listing Created"
    res.redirect("/listings");  //after 'Add' the new listing in 'new.ejs' the page'll redirect to main /listings page & add the new listing(place)
};

//58(B). 'EDIT' Route rendering (moved from 'routes/listing.js' here)
module.exports.renderEditForm = async (req, res) => {     
    let {id} = req.params;                                                      
    const listing = await Listing.findById(id);    //find the listing places(data.js) by _id you wanna edit/update

    //55(K). If specific listing not avail., & user wanna see it then this flash error msg will display 
    if(!listing){   
        req.flash("error", "Listing you requested for doesn't exist!");   //55(K). 'name : value' pair used in flash, in which after a specific listing not found(exist), a flash error msg shows "Listing you requested for doesn't exist!"
        return res.redirect("/listings");    //after flash msg, redirect to main /listings page
    }

    //59(B). On edit form page, there'll be org. img display before new img upload btn, so that user can see the before org img
    let originalImageUrl = listing.image.url;    //taking out org img URL from your DB(Cloudinary link)
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");    //modifies that URL so Cloudinary returns a resized version of the img: width = 250px(w_250) & then new URL is stored in originalImageUrl
    res.render("listings/edit.ejs", {listing, originalImageUrl});   //sending/rendering the listing _id to edit.ejs file(for edit/update that specific list), showing original before img along new upload imag btn option
};

//58(B). 'UPDATE' Route redirecting (moved from 'routes/listing.js' here)
module.exports.updateListing = async (req, res) => {                                                                                    
    let {id} = req.params; //Take the value of :id from the URL path parameters to make updation on that specific listing id

    //update the specific listing using its _id
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    //If user uploads a new image → req.file exists, If user does not upload a new image → req.file is undefined
    if(typeof req.file !== "undefined"){
        //from req.file only select 'url' & 'filename' of the img uploaded, to store in MongoDB 
        //Add uploaded image to DB
        let url = req.file.path;     //From Cloudinary upload, req.file.path = image URL
        let filename = req.file.filename;     //image name saved on Cloudinary

        listing.image = {url, filename};  //Updates the listing’s image in the database
        await listing.save();     //saves it
    }

    req.flash("success", "Listing Updated!");   //55(I). 'name : value' pair used in flash, in which after a listing updated a flash msg shows "Listing Updated!"
    res.redirect(`/listings/${id}`);   //after clicking on Edit btn redirect to 'show.ejs' (listing details page), there is details about that specific listing _id
};

///58(B). 'DELETE/DESTROY' Route redirecting (moved from 'routes/listing.js' here)
module.exports.deleteListing = async (req, res) => {    
    let {id} = req.params; //Take the value of :id from the URL path parameters for deletion of that specific listing id

    //update the specific listing using its _id
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");   //55(I, J). 'name : value' pair used in flash, in which after delete listing a flash msg shows "Listing Deleted!"
    res.redirect("/listings");
};