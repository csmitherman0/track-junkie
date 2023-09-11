const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Track = require('./models/track');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { trackSchema } = require('./schemas.js')


mongoose.connect('mongodb://localhost:27017/track-junkie', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('MONGOOSE CONNECTION OPEN');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate); // Use ejs-mate for ejs templates
app.use(express.urlencoded({ extended: true })); // Body-parsing middleware. The request body is undefined by default.
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // For static assets


const validateTrack = (req, res, next) => {

    const { error } = trackSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

/****************************
 * 
 * BEGIN EXPRESS ROUTES
 * 
 ****************************/

// Home
app.get('/', (req, res) => {
    res.render('tracks/home');
})

// Index
app.get('/tracks', catchAsync(async (req, res) => {
    const tracks = await Track.find({});
    res.render('tracks/index', { tracks });
}))

// New
app.get('/tracks/new', catchAsync((req, res) => {
    res.render('tracks/new');
}));

app.post('/tracks', validateTrack, catchAsync(async (req, res, next) => {
    // if (!req.body.track) throw new ExpressError('Invalid Campground Data', 400);

    const track = new Track(req.body.track);
    await track.save();
    res.redirect(`/tracks/${track._id}`);
}));

// Edit
app.get('/tracks/:id/edit', catchAsync(async (req, res) => {
    const track = await Track.findById(req.params.id);
    res.render('tracks/edit', { track });
}));

app.put('/tracks/:id', validateTrack, catchAsync(async (req, res) => {
    await Track.findByIdAndUpdate(req.params.id, { ...req.body.track });
    res.redirect(`/tracks/${req.params.id}`);
}));

// Delete
app.delete('/tracks/:id', catchAsync(async (req, res) => {
    await Track.findByIdAndDelete(req.params.id);
    res.redirect('/tracks');
}));

// Show
app.get('/tracks/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const track = await Track.findById(id);

    res.render('tracks/show', { track });
}))


// 404 Route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// Error Handlers
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(8080, () => {
    console.log('Listening on port 8080. . .');
});