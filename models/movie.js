const mongoose = require('mongoose');

var movieDetails = new mongoose.Schema({

    fullName: {
        type: String,
        required: 'This field is required'
    },
    img: {
        type: String,
    },
    summary: {
        type: String,
        required: 'This field is required'
    }
});

mongoose.model('movie', movieDetails);
