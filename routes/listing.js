//54(C). RESTRUCTURING '.models/listing.js' to '.routes/listing.js' using 'express.Router()'
const express = require("express");
const router = express.Router();   //creating router object for listing routes

//51(D). Require wrapAsync module from /utils/wrapAsync.js
const wrapAsync = require("../utils/wrapAsync.js");   //'../' to go back to parent dir then utils dir

//Require listing models from listing.js file
const Listing = require("../models/listing.js");      //'../' to go back to parent dir then models dir

//57(A). Require exported module of func. 'isLoggedIn' of 'middleware.js'
const {isLoggedIn} = require("../middleware.js");  //{isLoggedIn} is func. so put inside {}

//57(H). Require 'isOwner' middleware from 'middleware.js' used here in 'listing.js'('isOwner' middleware to check, if user is owner or not)
const {isOwner} = require("../middleware.js");

//57(H). Require 'validateListing' middleware from 'middleware.js' used here in 'listing.js'
const {validateListing} = require("../middleware.js");

//58(A). Require 'listingController' from MVC(from 'controller/listings.js')
const listingController = require("../controllers/listings.js");

//58(G). Require 'multer' package, so that img get uploaded in New form(firstly 'npm i multer')
const multer  = require('multer')    

//58(I). Require 'stored' module(middleware) from '../cloudConfig.js' to use here
const {storage} = require("../cloudConfig.js");

//58(G). Require 'upload' to store uploaded files in 'storage' dest. of cloudinary (Local storage setup)
const upload = multer({ storage });   //multer'll help in storing/saving the files(img etc) in storage of cloudinary

/*
//Now, we will restructure all routes by:
//moving all listing routes from app.js to here-> 'app' to 'router' -> remove 'listings' (only keep '/') in each route
*/

/*
//47(E). 'Index/main' Route for /listings
//app.get("/listings", wrapAsync(async(req, res) => {

router.get("/", wrapAsync(async(req, res) => {    //making 'app' to 'router' & remove 'listings'(common path from each routes, only keep '/') bcoz we are restructuring using express.Router()
    const allListings = await Listing.find({});     //printing all listing places of data.js file & store in var listings
    res.render("listings/index.ejs", {allListings});     //sending/rendering listing places to dir 'listings/index.ejs' file 
}));
*/ /*
//58. Here, we are designing 'Controller' from 'MVC'(Model View Controller) & export it. To make 'routes/listing.js' file CRUD oper. ROUTES look clean
//58(A). 'INDEX/main' Route for '/listings' (moved 'async(...){...}' all code part to 'controllers/listings.js') by passing 'listingController.index' as a function/callback here
router.get("/", wrapAsync (listingController.index));   //('listingController.index': bcoz inside required 'listingController' file there is 'Index' route used), from 'controllers/listings.js' to make 'Index' Route clean
*/

//58(D). Grouping all HTTP methods(get,post...) inside 'router.route()' for presize & cleaner look
// 'Index (/listings) & Create (listings/new)' Route (Bcoz of same routes starting URL)
router.route("/")
    .get(wrapAsync (listingController.index))   //('listingController.index': bcoz inside required 'listingController' file there is 'Index' route used), from 'controllers/listings.js' to make 'Index' Route clean
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync (listingController.createListing));  //('listingController.createListing': bcoz inside required 'listingController' file there is 'Create' route used), from 'controllers/listings.js' to make 'Create' Route clean
    
//Keeping 'New' Route in b/n of 'Index, Create' & 'Show, Update, Delete' Route 
//58(B). 'New'(New & Create Route) for GET /listings/new (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.get("/new", isLoggedIn, listingController.renderNewForm);  //('listingController.new': bcoz inside required 'listingController' file there is 'New' route used), from 'controllers/listings.js' to make 'New' Route clean

//CATEGORY FILTER ROUTE  (must be before :id route)
router.get("/category/:category", wrapAsync(async (req, res) => {
    const { category } = req.params;
    const listings = await Listing.find({ category });
    res.render("listings/index.ejs", { allListings: listings, category });
}));

// 'Show, Update, Delete' Route     
router.route("/:id")
    .get(wrapAsync (listingController.showListing))  //('listingController.show': bcoz inside required 'listingController' file there is 'Show' route used), from 'controllers/listings.js' to make 'Show' Route clean
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync (listingController.updateListing))   //('listingController.updateListing': bcoz inside required 'listingController' file there is 'Update' route used), from 'controllers/listings.js' to make 'Update' Route clean
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));    //('listingController.deleteListing': bcoz inside required 'listingController' file there is 'Delete' route used), from 'controllers/listings.js' to make 'Delete' Route clean

//58(B). 'EDIT' Route for edit the existing specific list(place) using _id (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));  //('listingController.renderEditForm': bcoz inside required 'listingController' file there is 'Edit' route used), from 'controllers/listings.js' to make 'Edit' Route clean


/*
//47(G). 'New'(New & Create Route) for GET /listings/new (creating a new listing form to add a place)
router.get("/new", isLoggedIn, (req, res) => {    //'isLoggedIn'-> used/passed as a middleware from 'middleware.js' for 'connecting login route', remove 'listings'(only keep '/new') bcoz we are restructuring using express.Router()
    //console.log(req.user);     //to show user related info(_id, email, username) in console after 'logged in' successfully & clicking on 'Add new listing'

    /*  //Moved this connecting 'login' route to 'middleware.js', so that together implemented for 'new, create, edit, update, delete' route once in 'listinng.js' as a middleware('isLoggedIn')
    //57(A). connecting 'login' route with 'new' route(check if user is logged in?)
    if(!req.isAuthenticated()){      //'req.isAuthenticated()' -> passport method which checks whether a user is currently logged in (authenticated) or not 
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");   //if user haven't logged in, return & redirect to /login page where user login for self(bcoz without login he can't 'Add new listing')
    }
    res.render("listings/new.ejs");
});
*/ /*
//58(B). 'New'(New & Create Route) for GET /listings/new (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.get("/new", isLoggedIn, listingController.renderNewForm);  //('listingController.new': bcoz inside required 'listingController' file there is 'New' route used), from 'controllers/listings.js' to make 'New' Route clean
*/

/*
//47(F). 'Read/Show' Route for GET /listings/:id (to read the details about listing specific places using _id)
router.get("/:id", wrapAsync(async (req, res) => {     //making 'app' to 'router' & remove 'listings'(common path from each routes, only keep '/:id') bcoz we are restructuring using express.Router()
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
}));
*/ /*
//58(B). 'SHOW' Route for GET /listings/new (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.get("/:id", wrapAsync (listingController.showListing));  //('listingController.show': bcoz inside required 'listingController' file there is 'Show' route used), from 'controllers/listings.js' to make 'Show' Route clean
*/

/*
//47(G). 'Create'(New & Create Route) for POST /listings (to redirect the new listing form to /listings page)
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {           //'isLoggedIn'-> used/passed as a middleware from 'middleware.js' for 'connecting login route', remove 'listings'(only keep '/') bcoz we are restructuring using express.Router(), 
                                                                                             // passed 'validateListing' middleware [51(H)] to validate the data before creating a new listing
    let newListing = new Listing(req.body.listing);   //req.body.listing contains all your fields: title: , description: , price: , etc(creating new listing using Listing model & req.body data from form)
    newListing.owner = req.user._id;    //store _id of specific current listing user(req.user) to new listing owner 
    await newListing.save();    //newListing is a Mongoose model, .save() to store new listing in this model structure to DB
    req.flash("success", "New Listing Created!");   //55(I). 'name : value' pair used in flash, in which after a new listing created a flash msg shows "New Listing Created"
    res.redirect("/listings");  //after 'Add' the new listing in 'new.ejs' the page'll redirect to main /listings page & add the new listing(place)
}));
*/ /*
//58(B). 'CREATE' Route for GET /listings/new (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.post("/", isLoggedIn, validateListing, wrapAsync (listingController.createListing));  //('listingController.createListing': bcoz inside required 'listingController' file there is 'Create' route used), from 'controllers/listings.js' to make 'Create' Route clean
*/

/*
//47(H). 'Edit'(Edit & Update Route) for edit the existing specific list(place) using _id
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {     //'isLoggedIn'-> used/passed as a middleware from 'middleware.js' for 'connecting login route', remove 'listings'(only keep '/:id/edit') bcoz we are restructuring using express.Router()
    let {id} = req.params;                                                       // 'isOwner'-> passed as a middleware from 'middleware.js' for check the authorization of the owner for its listing
    const listing = await Listing.findById(id);    //find the listing places(data.js) by _id you wanna edit/update

    //55(K). If specific listing not avail., & user wanna see it then this flash error msg will display 
    if(!listing){   
        req.flash("error", "Listing you requested for doesn't exist!");   //55(K). 'name : value' pair used in flash, in which after a specific listing not found(exist), a flash error msg shows "Listing you requested for doesn't exist!"
        return res.redirect("/listings");    //after flash msg, redirect to main /listings page
    }

    res.render("listings/edit.ejs", {listing});   //sending/rendering the listing _id to edit.ejs file(for edit/update that specific list)
}));
*/ /*
//58(B). 'EDIT' Route for edit the existing specific list(place) using _id (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));  //('listingController.renderEditForm': bcoz inside required 'listingController' file there is 'Edit' route used), from 'controllers/listings.js' to make 'Edit' Route clean
*/

/*
//47(H). 'Update'(Edit & Update Route) for update the existing specific list(place) with new listing using _id & redirect to main /listings page
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {     //'isLoggedIn'-> used/passed as a middleware from 'middleware.js' for 'connecting login route', remove 'listings'(only keep '/:id') bcoz we are restructuring using express.Router(),
                                                                                      // 'isOwner'-> passed as a middleware from 'middleware.js' for check the authorization of the owner for its listing, validateListing middleware [51(H)] to validate the data before updating a listing
    let {id} = req.params; //Take the value of :id from the URL path parameters to make updation on that specific listing id

      //Moved to middleware.js as a 'isOwner' middleware to check, if user is owner or not
    //57(H). Authorization for /listings
    //let listing = await Listing.findById(id);   //the _id of listing the user wanna update
    //if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)){    //check if that listing owner is not = currUser Id(stored in .locals) 
    //    req.flash("error", "You don't have permission to edit");     //this error msg'll flash
    //    return res.redirect(`/listings/${id}`);     //& redirect to that same /listings/:id page
    //}
    

    //update the specific listing using its _id
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated!");   //55(I). 'name : value' pair used in flash, in which after a listing updated a flash msg shows "Listing Updated!"
    res.redirect(`/listings/${id}`);   //after clicking on Edit btn redirect to 'show.ejs' (listing details page), there is details about that specific listing _id
}));
*/ /*
//58(B). 'UPDATE' Route for update the existing specific list(place) using _id (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync (listingController.updateListing));   //('listingController.updateListing': bcoz inside required 'listingController' file there is 'Update' route used), from 'controllers/listings.js' to make 'Update' Route clean
*/

/*
//47(I). 'Delete/Destroy' Route (to delete the specific listing using its _id)
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {    //'isLoggedIn'-> used/passed as a middleware from 'middleware.js' for 'connecting login route',remove 'listings'(only keep '/:id') bcoz we are restructuring using express.Router()
    let {id} = req.params; //Take the value of :id from the URL path parameters for deletion of that specific listing id

    //update the specific listing using its _id
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");   //55(I, J). 'name : value' pair used in flash, in which after delete listing a flash msg shows "Listing Deleted!"
    res.redirect("/listings");
}));
*/ /*
//58(B). 'DELETE/DESTROY' Route for delete the existing specific list(place) using _id (rest code moved to 'controllers/listings.js' for Controller [MVC])
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));    //('listingController.deleteListing': bcoz inside required 'listingController' file there is 'Delete' route used), from 'controllers/listings.js' to make 'Delete' Route clean
*/

//exporting router object to 'app.js' to use these listing routes in app.js
module.exports = router; 
