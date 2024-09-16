const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campground = require("../models/campground");
const Review = require("../models/review");
const { campgroundSchema, reviewSchema } = require('../schemas.js');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/',validateReview, catchAsync(async(req,res)=>{
    const camp = await campground.findById(req.params.id);
    const revi = new Review(req.body.review);
    camp.reviews.push(revi);
    await revi.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewID', catchAsync(async(req,res)=>{
    const {id,reviewID} = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;