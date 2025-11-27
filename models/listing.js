const mongoose = require("mongoose");
const Schema = mongoose.Schema;   
const Review = require("./review.js"); 
const { required } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,

    coordinates: {
    lat: Number,
    lng: Number
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,    
            ref: "Review",    
        }
    ],

    category: {
        type: String,
        enum: [
            "rooms",
            "iconic cities",
            "mountains",
            "castles",
            "amazing pools",
            "camping",
            "beach",
            "deserts",
            "arctic",
        ],
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {    
    if(listing) {    
      await Review.deleteMany({_id: {$in: listing.reviews}});  
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
