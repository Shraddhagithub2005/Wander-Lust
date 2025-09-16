const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
// const Review = require("../models/review.js");
// const { reviewSchema } = require("../schema.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const listingController = require("../controllers.js/listings.js");

router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.createListing));


// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
    isLoggedIn, 
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,
    isOwner,
     wrapAsync (listingController.destroyListing));


// Index Route
// router.get("/",wrapAsync (listingController.index));



// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
// router.post("/",validateListing, wrapAsync(listingController.createListing));


// Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.renderEditForm));

// update route
// router.put("/:id",
//     isLoggedIn, 
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));

// delete route
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//      wrapAsync (listingController.destroyListing));


module.exports=router;