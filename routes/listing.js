const express = require("express");
const router = express.Router();   
const wrapAsync = require("../utils/wrapAsync.js");   
const Listing = require("../models/listing.js");  
const {isLoggedIn} = require("../middleware.js"); 
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')    
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });   

router.route("/")
    .get(wrapAsync (listingController.index))  
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync (listingController.createListing));  
    
router.get("/new", isLoggedIn, listingController.renderNewForm);  

router.get("/category/:category", wrapAsync(async (req, res) => {
    const { category } = req.params;
    const listings = await Listing.find({ category });
    res.render("listings/index.ejs", { allListings: listings, category });
}));
    
router.route("/:id")
    .get(wrapAsync (listingController.showListing))  
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync (listingController.updateListing))  
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));   

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));  

module.exports = router; 
