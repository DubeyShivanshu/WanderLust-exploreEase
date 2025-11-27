//56(I). SignUp user - GET
const express = require("express");
const router = express.Router();   //creating a mini version of a router object — which is use to define routes separately and then export them to app.js
const User = require("../models/user.js");  //requiring 'user' model from '/models/user.js'
const wrapAsync = require("../utils/wrapAsync");   //require 'wrapAsync' for error-handling

//56(K). Require 'passport' package so that 'passport.authenticate("local", {failureRedirect: "/login", failureFlash: true})' middleware operates
const passport = require("passport");
//57(E). Require 'saveRedirectUrl' middleware from middleware.js to use here by passing in POST /login route
const {saveRedirectUrl} = require("../middleware.js");

//58(C). Require 'userController' from MVC(from 'controller/reviews.js')
const usercontroller = require("../controllers/users.js");

//58(D). Grouping all HTTP methods(get,post...) inside 'router.route()' for presize & cleaner look
// GET - 'SignUp' Middleware(for rendering at '/signup.ejs' file) & POST - "Signup" middleware(for registering by sending(post) the user info)
router.route("/signup")
    .get(usercontroller.renderSignupForm)   //('userController.renderSignupForm': bcoz inside required 'userController' file there is 'renderSignupForm' route used), from 'controllers/users.js' to make 'renderSignupForm' Route clean
    .post(wrapAsync(usercontroller.signup));   //('userController.signup': bcoz inside required 'userController' file there is 'signup' route used), from 'controllers/users.js' to make 'signup' Route clean

// GET - 'Login' user middleware(to render at '/login.ejs' file & see if the user already login or not) & POST - 'Login' user middleware(after filling user info in login page & then check info from db that if it correct or not)
router.route("/login")
    .get(usercontroller.renderLoginForm)
    .post(saveRedirectUrl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), usercontroller.login);   //this POST route(middleware in copied) can be seen from 'npmjs.com -> search 'passport-local' -> in 'Authenticate Requests'
                                                                                                                            //saveRedirectUrl : a middleware here passed using in middleware.js for save the original URL in req.session.redirectUrl After login, you want to send the user back to the same page
                                                                                                                            //passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) -> checks the user info, if user logged in successfully 

/*
//56(I). GET - 'SignUp' Middleware(for rendering at '/signup.ejs' file)
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});
*/ /*
//58(C). GET - 'SignUp' Middleware(for rendering at '/signup.ejs' file)
router.get("/signup",usercontroller.renderSignupForm);    //('userController.renderSignupForm': bcoz inside required 'userController' file there is 'renderSignupForm' route used), from 'controllers/users.js' to make 'renderSignupForm' Route clean
*/

/*
//56(J). POST - "Signup" middleware(for registering by sending(post) the user info)
router.post("/signup", wrapAsync(async(req, res) => {
    try{
        //extract username, email, pass. from body
        let {username, email, password} = req.body;

        //creating new user by passing its email & username 
        const newUser = new User({email, username});   

        //creating a new registered user which automatically hashes + stores the password in the database using .register()
        const registeredUser = await User.register(newUser, password);   //.register()-> this func. automatically hashes the pass. + adds salt & save them to db
        console.log(registeredUser);    //user registered'll show in console

        //57(D). After the user successfully signed up, it also automatically logged in
        req.login(registeredUser, (err) => {
            //while 'login' if error occurs
            if(err){
                return next(err);
            }
            //if not, then flash login msg & reddirect
            //display flash msg after successfully registered & logged in
            req.flash("success", "Welcome to Wanderlust!");

            //Then, after successfully registered & logged in, redirect to main '/listings'
            res.redirect("/listings");
        });
    } 
    catch(err){
        //if error occurs as- user already exist/registered etc then, flash error msg with redirect on same /signup page
        req.flash("error", err.message);  //"error" key with err.message "A user with the given username is already registered"
        res.redirect("/signup");
    };
}));
*/ /*
//58(C). POST - "Signup" middleware(for registering by sending(post) the user info)
router.post("/signup", wrapAsync(usercontroller.signup));   //('userController.signup': bcoz inside required 'userController' file there is 'signup' route used), from 'controllers/users.js' to make 'signup' Route clean
*/

/*
//56(K). GET - 'Login' user middleware(to render at '/login.ejs' file & see if the user already login or not)
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
*/ /*
//58(C). GET - 'Login' user middleware(to render at '/login.ejs' file & see if the user already login or not)
router.get("/login", usercontroller.renderLoginForm);
*/

/*
//POST - 'Login' user middleware(after filling user info in login page & then check info from db that if it correct or not)
router.post("/login", saveRedirectUrl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), async(req, res) => {    //this POST route(middleware in copied) can be seen from 'npmjs.com -> search 'passport-local' -> in 'Authenticate Requests'
                                                                                                                            //saveRedirectUrl : a middleware here passed using in middleware.js for save the original URL in req.session.redirectUrl After login, you want to send the user back to the same page
                                                                                                                            //passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) -> checks the user info, if user logged in successfully 
                                                                                                                            // then only 'async(req, res)..' will work,otherwise the .authenticate middleware operates & redirect to /login page
    req.flash("success", "Welcome back to Wanderlust!");  //after successfully logged in flash this msg   
    
    //User tries to access a protected route(Edit/Create) WITHOUT login || User directly visits /login without trying to access anything
    let redirectUrl = res.locals.redirectUrl || "/listings";   
    res.redirect(redirectUrl);     //(it copies the value from the req.session.saveRedirectUrl into res.locals.redirectUrl, to directly reach at 'Add new listing'/'Edit your listing' form)
                                              //user wanna add/perform something then firstly had to login, after then it automatically redirect to the Url where user was performing (using from 'middleware.js' [57(E)])                                                                                      
});
*/ /*
//58(C). POST - 'Login' user middleware(after filling user info in login page & then check info from db that if it correct or not)
router.post("/login", saveRedirectUrl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), usercontroller.login);   //this POST route(middleware in copied) can be seen from 'npmjs.com -> search 'passport-local' -> in 'Authenticate Requests'
                                                                                                                            //saveRedirectUrl : a middleware here passed using in middleware.js for save the original URL in req.session.redirectUrl After login, you want to send the user back to the same page
                                                                                                                            //passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) -> checks the user info, if user logged in successfully 
*/

/*                                                                                                                            
//57(B). GET - 'Logout' user middleware
router.get("/logout", (req, res, next) => {
    req.logout((err) => {      //req.logout() -> passport method, used for logout the user('err' is passed inside, so that if error occurs while logout then call next())
        if(err){
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    });
});
*/
//58(C). GET - 'Logout' user middleware
router.get("/logout", usercontroller.logout);

//export router module
module.exports = router;