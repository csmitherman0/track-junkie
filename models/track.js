const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
    title: String,
    length: Number,
    description: String,
    image: String,
    artist: String
});

module.exports = mongoose.model('Track', TrackSchema);