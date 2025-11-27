//58(H). Cloud setup(install & require 'dotenv' package -> firstly 'npm i dotenv')
//If NOT in production → load .env (This code is a safe way to load .env only in development, not in production)
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();     //loads the .env file into process.env
};

//Main page of backend
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//Require wrapAsync module from /utils/wrapAsync.js
const wrapAsync = require("./utils/wrapAsync.js");

//51(E). import/require 'ExpressError' module from /utils/ExpressError.js
const ExpressError = require("./utils/ExpressError.js");

//54(C). import/require 'listing router' from '/routes/listing.js' file
const listingRouter = require("./routes/listing.js");
//54(D). import/require 'review router' from '/routes/review.js' file
const reviewRouter = require("./routes/review.js");
//56(I). import/require 'user router' from '/routes/user.js' file
const userRouter = require("./routes/user.js");

//55(G). import/require 'express-session' & 'connect-mongo' package(firstly install package by-> 'npm i express-session connect-mongo')
const session = require("express-session");
//61(B). import/require 'connect-mongo' package for using the 'sessions' at 'PRODUCTION' level while connection build at MongoDB ATLAS(firstly install package by-> 'npm i connect-mongo')
const MongoStore = require('connect-mongo');

//55(I). import/require 'connect-flash'(firstly install package by-> 'npm i connect-flash')
const flash = require("connect-flash");

//56(G). import/require 'passport', 'passport-local', 'user model'(from 'user.js')
//       (firstly install-> 'npm i passport passport-local passport-local-mongoose')
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//for "views" dir
const path = require("path");   
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));   //for parsing url to make readable(Read/Show Route)

//requiring method-override package (for 'PUT' method in 'edit.ejs' file)
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//48(A). Creating boilerplate
//requiring ejsMate(install package-> 'npm i ejs-mate')
//this lets you reuse one common layout(like header, footer, navbar) on all your .ejs pages
const ejsMate = require("ejs-mate");     
app.engine('ejs', ejsMate);

//require 'models/listing.js' for SEARCH Route
const Listing = require("./models/listing");

//for "public" dir
app.use(express.static(path.join(__dirname, "public")));

//building connection b/n DB and Node
//Using MongoDB ATLAS for building connection with 'MongoDB ATLAS' & deploy(required in .env file to use here)
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to DB!");
}).catch(err => {console.log(err)});

async function main(){
    await mongoose.connect(dbUrl);    //passing 'dbUrl' to build connection with MongoDB ATLAS successfully
};

/*
//54(C). Now, we will move these all routes, requiring middleware(of upper side) from here & restructure all listing routes from app.js to '/routes/listing.js' file using 'express.Router()'
// We've moved all listing routes(like- Index, New, Show, Create, Update, Delete) & review routes(Post review, Delete review) to ./routes/listing.js & /routes/review.js respectively
//   & used express.Router() to restructure by separating the routes for clean code structure of app.js
// We'll import those routes here in app.js & use them with app.use() [54(C), 54(D)]
// We'll also remove validation middlewares [53(F). User level Validation for Review Schema & 51(H). User level Validation for Listing Schema] from here & move them to their respective 
//   route files(/routes/review.js & /routes/listing.js) for better code structure
//54(D, E). Now, we will move these all routes from here & restructure all review routes from app.js to '/routes/review.js' file using 'express.Router()'
*/

//Creating new mongo store to create & store the sessions
const store = MongoStore.create({
    mongoUrl: dbUrl,            //'dbUrl' is the connection string stored in .env(Save sessions in MongoDB Atlas)
    touchAfter: 24 * 3600,      //Update session only once every 24 hrs in seconds(to reduce DB load)
});
//using 'store.on()' if any error occurs on MongoDB session store, then  
store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

//55(G). Setting sessionOptions & using express-session middleware
const sessionOptions = {
    store,         //storing upper defined 'store' var. name inside
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //cookie's session valid for 7 days -> current date to(+) 7 days * 24hrs * 60min * 60sec * 1000 milisec
        maxAge: 7 * 24 * 60 * 60 * 1000,    //cookie lifetime (countdown from when it’s created
        httpOnly: true,   //helps prevent XSS (Cross-Site Scripting) attacks because malicious scripts can’t read or steal the cookie(adds security by hiding cookie from client-side JS)
    },
};

//Root Route
// app.get("/", (req, res) => {
//     res.send("Hi! I'm root");
// });

//using "express-session" & "sessionOptions" middleware
app.use(session(sessionOptions));

//55(I). using "connect-flash" middleware(for flash Msg of creating a new listing)
app.use(flash());

//56(G). Using 'passport.initializing' middleware
app.use(passport.initialize());    //Initializes Passport for authentication(Starts Passport; prepares it to handle login requests)
app.use(passport.session());     //use the session(the user’s "locker") to remember who’s logged in — even after the page is refreshed or a new request is made

//use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));   //use the Local Strategy(username + password)for login, & let UserActivation.authenticate() handle how to check if the user is valid

//use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());    //Save user info into session(When a user logs in, Passport stores the user’s ID inside the session cookie)→ how to store user ID in session
passport.deserializeUser(User.deserializeUser());   //Fetch full user data back from DB(Now, on the next req.(say, visiting /profile), Passport reads the session cookie)→ how to get user data from ID

//55(I). A flash middleware for using req.flash("success", "New Listing Created") in '/routes/listing.js' & 
// including "success" msg in '/views/layouts/boilerplate.ejs' & display in '/views/includes/flash'(so that it'ld show at every .ejs page) 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");  //55(J). if a new listing created(added)
    res.locals.error = req.flash("error");     //55(K). if specific listing not avail. & user want to see
    
    res.locals.currUser = req.user;   //57(C). storing logged in current user details in var. currUser, so that used in 'includes/navbar.ejs' for styling SignUp, Login, Logout
    next();
});

//54(C). Using 'listing' routes & 'listingRouter' from '/routes/listing.js' file in app.js
app.use("/listings", listingRouter);   //prefixing all listing routes with '/listings'
//54(D). Using 'review' routes & 'reviewRouter' from '/routes/review.js' file in app.js
app.use("/listings/:id/reviews", reviewRouter);   //prefixing all review routes with '/listings/:id/reviews'
//56(I). Using 'user' routes & 'userRouter' from '/routes/user.js' file in app.js
app.use("/", userRouter);

//ADD 'SEARCH' ROUTE(to get the listing when searched) 
app.get("/search", wrapAsync(async (req, res) => {
    const query = req.query.q;

    const results = await Listing.find({
        title: { $regex: query, $options: "i" }
    });

    res.render("listings/searchResults", { results, query });
}));

//51(E). ExpressError handling middleware

// app.all(/.*/, (req, res, next) => {           //If route not found → make 404 error → pass to error handler
//     next(new ExpressError("Page Not Found", 404));
// });
                //OR
app.use((req, res, next) => {                    //If route not found → make 404 error → pass to error handler
    next(new ExpressError(404, "Page Not Found"));
});

//custom error handling middleware(to handle all errors passed using next(err))
app.use((err, req, res, next) => {          
    let {statusCode=500, message="Something went wrong!"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {statusCode, message});   //rendering error.ejs file for any error occurred
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});