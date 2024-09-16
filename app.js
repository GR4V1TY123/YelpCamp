const express = require('express');
const app = express();
const path = require('path')
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')

const campgrounds = require('./routes/campgrounds.js')
const reviews = require('./routes/reviews.js')



mongoose.connect('mongodb://localhost:27017/yelp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'docs'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}
app.use(session(sessionConfig))

app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get("/", (req,res)=>{
    res.render('grounds/home.ejs');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('./err', { err })
})


app.listen('3000', ()=>{
    console.log("Server Running...........");
})