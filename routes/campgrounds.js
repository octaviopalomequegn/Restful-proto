var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var moment = require("moment");
var middleware = require("../middleware");



//INDEX - show all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    })
})

//POST ROUTE FOR CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.body;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    }

    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log("Error: " + err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
})

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
})

//SHOW MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log("ERROR " + err)
        } else {
            console.log(foundCampground);
            console.log(foundCampground.comments)

            res.render("campgrounds/show", {
                moment: moment,
                campground: foundCampground
            });
        }
    })
})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        })
    })
})


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        res.redirect("/campgrounds/" + req.params.id);
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        res.redirect("/campgrounds");
    })
})

module.exports = router;
