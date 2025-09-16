 const { string, number } = require("joi");
const mongoose = require("mongoose");
// const { create } = require("./listing");
 const Schema = mongoose.Schema;

 const reviewSchema = new Schema({
    comment: {
        type: String,   
        required: true
    },
    rating: {
        type:Number,
        min:1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Review"   // ✅ reference to Listing model
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
 });

 module.exports = mongoose.model("Review", reviewSchema);