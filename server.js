require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyPreser = require('body-parser');

const movieController = require('./controller/movieController');
const app = express();
app.use(bodyPreser.urlencoded({
    extended: true
}));

app.use(bodyPreser.json());

app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(3000, function() {

    console.log('Server 3000 is start running');
});


app.use('/movie', movieController);
app.use('/index', movieController);