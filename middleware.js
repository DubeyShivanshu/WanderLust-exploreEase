//57(H). Require 'models/listing' to use it in 'isOwner' middleware (below)
const Listing = require("./models/listing");

//57(J). Require 'models/review' to use it in 'isReviewAuthor' middleware (below)
const Review = require("./models/review");

//51(E). import/require ExpressError module from /utils/ExpressError.js
const ExpressError = require("./utils/ExpressError.js");

//51(G). import/require 'listingSchema' & 'reviewSchema' from '/schema.js' file for data validation using JOI 
const { listingSchema, reviewSchema } = require("./schema.js");

//57(A). connecting 'login' route with 'new, edit, create, update, delete' route(check if user is logged in?)

//exporting a middleware function called 'isLoggedIn' so it can be reused in other files
// (like routes- 'new, edit, create, update, delete' by passing 'isLoggedIn' as middleware in these routes in 'listing.js')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){      //'req.isAuthenticated()' -> passport method which checks whether a user is currently logged in (authenticated) or not 

        //57(E). save redirectUrl(means- if the user wanna add/perform something then firstly had to login, after then it automatically redirect to the Url where user was performing, using in 'routes/user.js')
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");   //if user haven't logged in, return & redirect to /login page where user login for self(bcoz without login he can't 'Add new listing')
    }
    next();
};

//57(E). 'saveRedirectUrl' middleware to save the redirectUrl & call 'saveRedirectUrl' in POST - '/login' route in user.js
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        //⬇️ Copy value from session to res.locals
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

/*57(E).
//NOTE: When a user tries to access a protected page without logging in:
        You save the original URL in req.session.redirectUrl
        After login, you want to send the user back to the same page
        This middleware helps pass that saved URL to res.locals, so you can use it inside EJS or controller after login.
    Ex: req.session.redirectUrl = "/listings/123/edit"

    FLOW DIAGRAM:-

    req.session.redirectUrl
        ⬇ copied into
    res.locals.redirectUrl
        ⬇ used for redirect
    res.redirect(res.locals.redirectUrl)


*/

//57(H). Authorization for /listings('isOwner' middleware to check, if user is owner or not), if yes, then only can edit, update listing
//to use listings firstly require it.(done above)
module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params; //Take the value of :id from the URL path parameters to make updation on that specific listing id
    let listing = await Listing.findById(id);   //the _id of listing the user wanna update
    if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)){    //check if that listing owner is not = currUser Id(stored in .locals) 
        req.flash("error", "You are not the owner of this listing");     //this error msg'll flash
        return res.redirect(`/listings/${id}`);     //& redirect to that same /listings/:id page
    }
    next();
};

//57(J). Authorization for /reviews('isReviewAuthor' middleware to check, if user is author(real reviewer) or not), if yes then only that author may delete its review
//to use reviews firstly require it.(done above)
module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params; //Take the value of id & :reviewId from the URL path parameters to make delete on that specific review id
    let review = await Review.findById(reviewId);   //the reviewId of review the user wanna delete
    if(!review.author || !review.author.equals(res.locals.currUser._id)){    //check if that review author is not = currUser Id(stored in .locals) 
        req.flash("error", "You are not the author of this review");     //this error msg'll flash
        return res.redirect(`/listings/${id}`);     //& redirect to that same /reviews/:id page
    }
    next();
};

//51(H). User level Validation for Schema(validateListing Middleware), to validate the data before creating/updating a listing by user(using 'JOI' listingSchema from schema.js) require & used in 'listing.js'
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);    //validating req.body data using listingSchema & store error in var error
    if(error){                                        //if any error found in validation
        let errMsg = error.details.map(el => el.message).join(",");   //taking all error details & join there messages with ','
        throw new ExpressError(400, errMsg);           //throwing custom ExpressError to error handling middleware
    } else {
        next();     //if no error found → pass to next()
    };
};

//53(F). User level Validation for Review Schema(validateReview Middleware), to validate the data before creating a review by user(using 'JOI' reviewSchema from schema.js)
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);    //validating req.body data using reviewSchema & store error in var error
    if(error){                                        //if any error found in validation
        let errMsg = error.details.map(el => el.message).join(",");   //taking all error details & join there messages with ','
        throw new ExpressError(400, errMsg);           //throwing custom ExpressError to error handling middleware
    } else {
        next();     //if no error found → pass to next()
    };
};