const mongoose = require('mongoose');
const Track = require('../models/track');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose Connection Error: '));
db.once('open', () => {
    console.log('MONGOOSE CONNECTION OPEN');
});