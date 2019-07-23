const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/movieDB', {useNewUrlParser: true },function (err) {
  if (!err) {
    console.log('Mongodb Connection Succeeded.');
  }else {
    console.log('Error in DB connection:' +err);
  }
});

require('./movie');
