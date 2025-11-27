//51(G). Validation for schema data using 'JOI' (to validate the data before creating/updating a listing)
//first install 'joi' package using 'npm i joi' -> then create a new file 'schema.js' in root dir -> then write the below code in schema.js file starting from require('joi')
const Joi = require("joi");

//defining user level schema for listing data validation using JOI
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        
        image: Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required()
        }).optional(),
        
        price: Joi.number().required().min(0),  //price should be a number, required & min value is 0(no negative price)
        country: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.string()
            .valid(
                "rooms",
                "iconic cities",
                "mountains",
                "castles",
                "amazing pools",
                "camping",
                "beach",
                "deserts",
                "arctic",
            )
            .optional(),
    }).required(),
});

//53(F). Validation for review schema data using 'JOI' (to validate the data before creating a review)
//defining user level schema for review data validation using JOI
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),   //rating should be a number b/w 1 to 5
        comment: Joi.string().required(),       //comment should be a string & required
    }).required(),
});

//Export listingSchema & reviewSchema both together to use in app.js file
module.exports = {listingSchema, reviewSchema};   //exporting reviewSchema to use in app.js file
