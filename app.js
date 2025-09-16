// if(process.env.NODE_ENV !="production"){
//     require('dotenv').config();
   
// }
//  console.log(process.env.SECRET);

// if(process.env.NODE_ENV !="production"){
//     require('dotenv').config();
// }
// console.log(process.env.SECRET);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');





const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./routes/review.js");


// const listings= require("./routes/review.js");
// const reviews = require("./routes/review.js");
// ✅ Use routes, not models
const ListingRouter = require("./routes/listing.js");
const ReviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL ="mongodb+srv://Shraddha:Waau8AmKU7cpfrqM@cluster0.6dg4mpm.mongodb.net/";

const dbUrl = process.env.ATLASDB_URL;


main()
    .then(() =>{
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}





app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600,
});

store.on("error", () =>{
    console.log("Error in Mongo Session Store", err);

});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    Cookie: {
        expires: Date.now() + 7 * 24 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly:true
    },
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // use to recognize the user is same or different trying to access data from another browser

app.use((req,res,next) =>{
    res.locals.currUser = req.user || null; 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // res.locals.currUser = req.user;
    next();
});

app.use("/listings", ListingRouter);
app.use("/listings/:id/reviews", ReviewRouter);
app.use("/", userRouter);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// app.get("/demouser", async(req,res) =>{
//     let fakeUser= new User ({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })






// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);


// 404 handler (for all unmatched routes)
// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });

// Error handler
// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//    res.status(statusCode).render("error.ejs", {message});
//     // res.status(statusCode).send(message);
// });
// Error handler
app.use((err, req, res, next) => {
    console.error("Error caught:", err);  // log details in terminal

    if (res.headersSent) {
        // if headers are already sent, delegate to default Express handler
        return next(err);
    }

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});



app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
