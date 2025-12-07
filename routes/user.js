const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/users.js")

// signupForm
router.get("/signup",userController.renderSignupForm);
//signup
router.post("/signup", wrapAsync(userController.signup));


//loginForm
router.get("/login",userController.renderLoginForm );
//login
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local"
        , {failureRedirect : '/login'
            , failureFlash : true}) 
            ,userController.login );


  //logout
router.get("/logout",userController.logout);

module.exports = router;
