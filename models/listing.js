 const mongoose = require("mongoose");
const review = require("./review");
 const Schema = mongoose.Schema;
 const Review = require("./review.js");

 const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {
      url: String,
      filename: String,
    },
    // image: String,
    price:{ 
    type:Number,
    default:0},
    location: String,
    country: String,
    reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref:"User",
  },
 });

 listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){ 
  await Review.deleteMany({reviews: {$in: listing.reviews}});
  };
 });



 const Listing = mongoose.model("listings", listingSchema);
 module.exports = Listing;