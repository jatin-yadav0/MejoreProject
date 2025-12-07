const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validReview, isLoggedIn, isRivewAuthor} = require("../middleware.js")
const reviewController = require("../controller/reviews.js");




// Review 
// Post route
router.post("/",
  isLoggedIn, validReview,  wrapAsync(reviewController.createReview ));


//Delete Review rout
router.delete("/:reviewId",
  isLoggedIn,
  isRivewAuthor,
   wrapAsync(reviewController.destroyReview) );

module.exports = router;