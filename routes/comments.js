var express = require("express");
var router = express.Router({
    mergeParams: true
});

var middleware = require("../middleware");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ============================================
// ============================================
// COMMENTS ROUTES


//Comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
})

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            })
        }
    })
});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted.")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//Comment create
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "You couldn't create the comment.")
                    console.log(err);
                } else {
                    //add username and ID to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.publicationDate = Date.now();
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Comment added.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

module.exports = router;
