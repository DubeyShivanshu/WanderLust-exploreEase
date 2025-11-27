//58. Here, we are designing 'Controller' from 'MVC'(Model View Controller) & export it. To make 'routes/user.js' file ROUTES look clean

//requiring 'user' model from '/models/user.js'
const User = require("../models/user.js");  

//58(C). GET - 'SignUp' Middleware(for rendering at '/signup.ejs' file)
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

//58(C). POST - "Signup" middleware(for registering by sending(post) the user info)
module.exports.signup = async(req, res) => {
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
};

//58(C). GET - 'Login' user middleware(to render at '/login.ejs' file & see if the user already login or not)
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

//58(C). POST - 'Login' user middleware(after filling user info in login page & then check info from db that if it correct or not)
module.exports.login = async(req, res) => {    
    req.flash("success", "Welcome back to Wanderlust!");  //after successfully logged in flash this msg   
    
    //User tries to access a protected route(Edit/Create) WITHOUT login || User directly visits /login without trying to access anything
    let redirectUrl = res.locals.redirectUrl || "/listings";   
    res.redirect(redirectUrl);     //(it copies the value from the req.session.saveRedirectUrl into res.locals.redirectUrl, to directly reach at 'Add new listing'/'Edit your listing' form)
                                              //user wanna add/perform something then firstly had to login, after then it automatically redirect to the Url where user was performing (using from 'middleware.js' [57(E)])                                                                                      
};

//58(C). GET - 'Logout' user middleware
module.exports.logout = (req, res, next) => {
    req.logout((err) => {      //req.logout() -> passport method, used for logout the user('err' is passed inside, so that if error occurs while logout then call next())
        if(err){
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    });
};