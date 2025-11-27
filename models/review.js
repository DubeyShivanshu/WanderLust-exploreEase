//53(C). Creating review model (schema)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//define reviewSchema
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,   //minimum rating 1
        max: 5,   //maximum rating 5
    },
    createdAt: {
        type: Date,
        default: Date.now,   //default value is current date/time
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

//export reviewSchema module
module.exports = mongoose.model("Review", reviewSchema);  //exporting model named "Review" with reviewSchema

//Now, after this we'll create review form in 'show.ejs' file to add reviews for specific listing(place) &
//  then we'll create POST route in app.js to handle this review form data & store this data in 'Review' model created above &
//  also embed this review in 'Listing' model(created in models/listing.js)