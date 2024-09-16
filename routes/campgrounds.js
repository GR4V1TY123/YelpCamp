const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campground = require("../models/campground");
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const mongoose = require("mongoose");


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get("/", async(req,res)=>{
    const camp = await campground.find({})
    res.render('index',{camp});
})

router.get("/new", async(req,res)=>{
    res.render('grounds/new');
})

router.post("/",validateCampground, catchAsync(async(req,res)=>{  
    const camp = new campground(req.body.Campground);
    await camp.save();
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.get("/:id", catchAsync(async(req,res)=>{
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid Campground ID');
        return res.redirect('/campgrounds');
    }
    const camp = await campground.findById(id).populate('reviews');
    if(!camp)
    {
        req.flash('error', 'Campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('grounds/show',{camp});
}))

router.get("/:id/edit", async(req,res)=>{
    const camp = await campground.findById(req.params.id);
    if(!camp)
        {
            req.flash('error', 'Cant Edit! (Campground does not exist)')
            return res.redirect('/campgrounds')
        }
    res.render('grounds/edit', {camp});
})

router.put("/:id", catchAsync(async(req,res)=>{
    const {id}=req.params;
    const camp = await campground.findByIdAndUpdate(id,req.body.Campground);
    
    req.flash('success', 'Updated campground successfully')
    res.redirect(`/campgrounds/${camp._id}`); 
}))

router.delete("/:id", async(req,res)=>{
    const {id}=req.params;
    const camp = await campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted campground successfully')
    res.redirect("/campgrounds");
})

module.exports = router;