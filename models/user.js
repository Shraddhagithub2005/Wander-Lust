const { required } = require("joi");
const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
});

userSchema.plugin(PassportLocalMongoose); //username,hashing,sorting,hash-password automatically impliment by passportLocalMongoose when we use in plugin

module.exports = mongoose.model("User", userSchema);