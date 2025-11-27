//58. Here, we are designing 'Controller' from 'MVC'(Model View Controller) & export it. To make 'routes/review.js' file ROUTES look clean

//require review models from '/models/review.js' file
const Review = require("../models/review.js");

//require listing models from listing.js file
const Listing = require("../models/listing.js");

//58(C). 'Post Reviews Routes'(to add reviews for specific listing places)
module.exports.createReview = async(req, res) => {    
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
};

//58(C). 'Delete/Destroy Review Route'(to delete specific review of specific listing using their _id)
module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;   //Accessing(destructuring) _id & reviewId from req.params

    //updating Listing model to pull/delete that specific reviewId from reviews array of that specific listing
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});   //'$pull' operator to remove specific reviewId from reviews array of that specific listing
    
    //deleting review from Review model using reviewId(here, whenever when we delete listing then its all reviews will be deleted using mongoose middleware in 'listing.js' file)
    await Review.findByIdAndDelete(reviewId);   //finding review by reviewId & deleting it
    
    //redirecting to show.ejs page of that specific listing place after deleting review
    req.flash("success", "Review Deleted!");   //55(I). 'name : value' pair used in flash, in which after a Review deleted a flash msg shows "Review Deleted!"
    res.redirect(`/listings/${id}`);    //using listing _id to redirect to that specific listing show page
};
