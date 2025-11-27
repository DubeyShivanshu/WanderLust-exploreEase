//47(D, E). 'Index' Route (initializing DB, & requiring data.js file)

const mongoose = require("mongoose");   //require db
const initData = require("./data.js");    //require data.js file
const Listing = require("../models/listing.js");   //require listing models from listing.js

//building connection b/n DB and Node
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust"    //'wanderlust' is (db name) & ex. of 'airbnb' site

main().then(() => {
    console.log("Connected to DB!");
}).catch(err => {console.log(err)});

async function main(){
    await mongoose.connect(MONGO_URL);
};

//initializing a func. initDB for DB
const initDB = async () => {
    //firstly completely delete the data of DB, if already/previously stored in it
    await Listing.deleteMany({});

    //Add owner to each listing BEFORE inserting all data.js listing schema
    initData.data = initData.data.map(obj => ({  //.map(in each obj. => (...obj, each obj. has owner prop. : "delta-student" _id)) & store this in initData.data, '.map()' loops through every object in initData.data
        ...obj,
        owner: "6914d0b84a21988a5a222811"   //"delta-student" _id from db.users.find()
    })); 

    //now, insert all data.js listing schema's(docs) using initData func
    await Listing.insertMany(initData.data);     
    console.log ("data was initialized");
};

//call 'initDB' func
initDB();   