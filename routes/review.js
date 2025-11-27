//54(D). RESTRUCTURING '.models/review.js' to '.routes/review.js' using 'express.Router()'
const express = require("express");
//creating a mini version of a router object — which is use to define routes separately and then export them to app.js
const router = express.Router({mergeParams : true});   //'mergeParams: true' tells Express to allow this small router to access URL parameters (like :id) from its parent route in app.js & creating router object

//51(D). import/require wrapAsync module from /utils/wrapAsync.js
const wrapAsync = require("../utils/wrapAsync.js");   //'../' to go back to parent dir then utils dir

//51(E). import/require ExpressError module from /utils/ExpressError.js
const ExpressError = require("../utils/ExpressError.js");

//require review models from '/models/review.js' file
const Review = require("../models/review.js");

//require listing models from listing.js file
const Listing = require("../models/listing.js");      //'../' to go back to parent dir then models dir
 
//57(H). import/require 'validateReview' middleware from 'middleware.js' to use here by passing in routes
const {validateReview} = require("../middleware.js");
//import/require 'isLoggedIn' middleware from 'middleware.js' to use here by passing in POST routes
const {isLoggedIn} = require("../middleware.js");
//57(J). import/require 'isReviewAuthor' middleware from 'middleware.js' to use here by passing in review DELETE routes
const {isReviewAuthor} = require("../middleware.js");

//58(C). import/require 'reviewController' from MVC(from 'controller/reviews.js')
const reviewController = require("../controllers/reviews.js");

//Now, we will restructure all routes by:
//moving all review routes from app.js to here-> 'app' to 'router' -> remove 'listings' (only keep '/') in each route

/*
//53(E). 'Post Reviews Routes'(to add reviews for specific listing places)(from 'models/review.js')
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => { 
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res) => {     //('app' to 'router' & remove 'listings/:id/reviews' bcoz of common on both routes, only keep '/')validateReview middleware [53(F)] to validate the data before creating a review by user
    //validating req.body data using reviewSchema before creating a new review
    let {id} = req.params;  
    let listing = await Listing.findById(id);
            //OR
    // let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);   //creating new review using Review model & req.body data from form
    newReview.author = req.user._id;       //when the user logged in, its _id will store as a author of newReview, then only newReview pushed in listing which also shows author
    //console.log(newReview);
    listing.reviews.push(newReview);               //pushing this newReview to listing's reviews array(db)

    //save both listing & newReview to DB
    await newReview.save();
    await listing.save();

    //sending success msg to console & res
    // console.log("New Review Added!");
    // res.send("Review Added Successfully!");

    //redirecting to show.ejs page of that specific listing place after adding review('db.reviews.find()' to see reviews in mongo shell)
    req.flash("success", "New Review Created!");   //55(I). 'name : value' pair used in flash, in which after a new Review created a flash msg shows "New Review Created"
    res.redirect(`/listings/${listing._id}`);    //using listing._id to redirect to that specific listing show page
}));
*/
//58(C). 'Post Reviews Route' to add(create) review(rest code moved to 'controllers/listings.js' for Controller [MVC])
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));   //('reviewController.createReview': bcoz inside required 'reviewController' file there is 'Post Review' route used), from 'controllers/reviews.js' to make 'Post Review' Route clean

/*
//53(I). 'Delete/Destroy Review Route'(to delete specific review of specific listing using their _id)
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;   //Accessing(destructuring) _id & reviewId from req.params

    //updating Listing model to pull/delete that specific reviewId from reviews array of that specific listing
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});   //'$pull' operator to remove specific reviewId from reviews array of that specific listing
    
    //deleting review from Review model using reviewId(here, whenever when we delete listing then its all reviews will be deleted using mongoose middleware in 'listing.js' file)
    await Review.findByIdAndDelete(reviewId);   //finding review by reviewId & deleting it
    
    //redirecting to show.ejs page of that specific listing place after deleting review
    req.flash("success", "Review Deleted!");   //55(I). 'name : value' pair used in flash, in which after a Review deleted a flash msg shows "Review Deleted!"
    res.redirect(`/listings/${id}`);    //using listing _id to redirect to that specific listing show page
}));
*/
//58(C). 'Delete/Destroy Review Route'(to delete specific review of specific listing using their _id)
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));    //('reviewController.deleteReview': bcoz inside required 'reviewController' file there is 'Delete Review' route used), from 'controllers/reviews.js' to make 'Delete Review' Route clean

//exporting router object to use in app.js
module.exports = router;