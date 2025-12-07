if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

// PASSPORT IMPORTS
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ROUTES
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { log } = require("console");

const dbUrl = process.env.ATLASDB_URL;
console.log(dbUrl);


// APP CONFIG
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// SESSION CONFIG

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err)=>{
  console.log("ERROR IN MONGO DB SESSION", err);
})

const sessionConfig = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: false, 
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3
  }
};


app.use(session(sessionConfig));
app.use(flash());

// PASSPORT SETUP (ORDER MATTERS)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// LOCALS
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ROUTES
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 HANDLER
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

// DB CONNECTION
async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log(" Connected to DB");
  } catch (err) {
    console.error(" DB Connection Error:", err.message);
    process.exit(1);
  }
}

connectDB().then(() => {
  app.listen(8080, () => {
    console.log("Server running on port 8080");
  });
});
