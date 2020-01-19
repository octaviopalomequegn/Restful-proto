var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

var seedDB = require("./seeds");


//Requiring routes

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

//"mongodb+srv://opalomequeg:op.3516402@cluster0-erdj4.mongodb.net/yelpcamp?retryWrites=true&w=majority"

//CONNECT TO THE DATABASE
mongoose.connect("mongodb+srv://opalomequeg:op.3516402@cluster0-erdj4.mongodb.net/yelpcamp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log('ERROR', err.message);
});

//INITIALIZE BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true
}));

//STABLISH PUBLIC DIRECTORY AS THE DEFAULT NAME FOR THE REQUIREMENTS OF EXPRESS
app.use(express.static(__dirname + "/public"));

//SET ENGINE EJS AS DEFAULT FOR VIEWS
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

//Initialize flash
app.use(flash());

//DESTROY AND REBUILD THE DATABASE
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again rusty wins",
    resave: false,
    saveUninitialized: false
}));



//Initialize passport (For sessions)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen((process.env.PORT || 3000), function () {
    console.log("Listening in port " + process.env.PORT)
})
