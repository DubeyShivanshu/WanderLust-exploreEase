//56(F). Example of making 'user' model for authentication/login page(using 'passport, passport-local, passport-local-mongoose' package)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//requiring 'passport-local-mongoose'(but firstly install its package-> "npm i passport-local-mongoose")
const passportLocalMongoose = require("passport-local-mongoose");  

//defining 'user' schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
    //Note: "username" & "password" schema are automatically added by "passport-local-mongoose". So, don't need to make their schema.
});

//this line automatically adds username + hashed password fields (attaching/enabling all the extra features to mongoose schema)
userSchema.plugin(passportLocalMongoose);

//exporting userSchema
module.exports = mongoose.model('User', userSchema);