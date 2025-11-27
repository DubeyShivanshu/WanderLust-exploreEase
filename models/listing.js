//47(B). Listing Model(inserting places & its respective schema's -> then export this model to app.js)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;    //store schema's of mongoose into 'Schema'

//53(J). importing review model(from models/review.js) to listing model(for embedding reviews in listing model)
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

        /*
        filename: {
            type: String,
            default: "default", },
        url: {
            type: String,
        */
            //This 'set: ' is used when img to hai pr link empty h(ye check krta h), ye mainly 'user/client' k liye hota h aur 'frontend' me use hoga
            //Ternary operator("set: (v)"): means we take value 'v' & if it is equals to ""(empty string means no img link) then condn (?),
            //  if true print default link URL->"https://....." given by user & if false then v(org. img, link provided(given any name/link) by user) 
            
            //set: (v) => v === "" ? "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D" : v,    

            //when no img given/shows then this default url img will be shown

            //default: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
            /*
              set: (v) => v === "" 
                ? "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D"
                : v,
              default: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D"
            */
    },
    price: Number,
    location: String,
    country: String,

    coordinates: {
    lat: Number,
    lng: Number
    },

    //embedding reviews in listing model(one to many relationship)(from 'models/review.js')
    reviews: [
        {
            type: Schema.Types.ObjectId,    //type of data is ObjectId
            ref: "Review",      //referencing 'Review' model to listing model(for embedding reviews in listing)(from models/review.js)
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

    //57(F). listing owner(schema for owner, so that it can edit/delete its own listing only)
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    //59(F). Storing coordinates schema using Mongoose 'GeoJSON'
    // geometry: {
    //     type: String, 
    //     enum: ['Point'],    //location type
    //     required: true
    // },
    // coordinates: {
    //     type: [Number],
    //     required: true
    // }
});

//53(J). Adding a Mongoose Middleware to delete all associated reviews when a listing is deleted(mtlb jb listing delete hoga to db se us listing k sare reviews bhi delete ho jayenge)
listingSchema.post("findOneAndDelete", async(listing) => {     //creating .post middleware on 'findOneAndDelete' method for listingSchema
    if(listing) {    //if listing found(deleted)
      await Review.deleteMany({_id: {$in: listing.reviews}});   //deleting all reviews whose _id is in the listing.reviews array
    }
});

//creating listing model
const Listing = mongoose.model("Listing", listingSchema);
//export listing model to app.js
module.exports = Listing;