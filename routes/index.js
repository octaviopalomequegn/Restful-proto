var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//REGISTER ROUTES

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", middleware.ableToRegister, function (req, res) {
    res.render("register");
});

router.post("/register", middleware.ableToRegister, function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            req.flash("error", err.message);
            res.redirect("/register");

        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    });
});

//LOGIN ROUTES
router.get("/login", middleware.ableToLogin, function (req, res) {
    res.render("login");
});

router.post("/login", middleware.ableToLogin, passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {});

//LOGOUT ROUTES
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
})

module.exports = router;
