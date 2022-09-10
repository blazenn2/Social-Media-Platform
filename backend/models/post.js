const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// <=================== POST SCHEMA ===================> //
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: String
    }
}, { timestamp: true });

module.exports = mongoose.model('posts', postSchema);