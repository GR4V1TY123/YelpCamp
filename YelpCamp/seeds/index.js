const express = require('express');
const app = express();
const path = require('path')
const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const {descriptors,places} = require("./seedhelpers");

mongoose.connect('mongodb://localhost:27017/yelp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const temp = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async()=>{
    await campground.deleteMany({});
    for(let i = 0; i < 50; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10000);
        const c = new campground({
            
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${temp(descriptors)} ${temp(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: price,
            description: "A campground is a designated outdoor area that provides facilities for people to set up temporary lodging, typically in tents, recreational vehicles (RVs), or cabins. These spaces are often located in natural settings, such as forests, mountains, or near bodies of water."
        })
        await c.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})