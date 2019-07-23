const express = require('express');
var multer = require('multer');
var router = express.Router();
const mongoose = require('mongoose');
const Movie = mongoose.model('movie');
const bodyparser = require('body-parser');


var app = express();
app.use(bodyparser.json());
app.use(function(res, resp, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELET, PUT');
})



var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});


var upload = multer({
    storage: storage,
    onFileUploadStart: function(file) {
        console.log(file.img + ' is starting ...')
    },
});



router.get('/', function(req, resp) {
    resp.render("movie/addOrEdit", {
        viewTitle: "Insert Movie"
    });
});

router.post('/', upload.single('img'), function(req, resp) {
    if (req.body._id == '')
        insertRecord(req, resp);
    else
        updateRecord(req, resp);
});


function insertRecord(req, resp) {
    var movie = new Movie();
    movie.fullName = req.body.fullName;
    movie.img = req.body.img;
    movie.summary = req.body.summary;
    movie.save(function(err, doc) {
        if (!err) {
            resp.redirect('movie/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                resp.render("movie/addOrEdit", {
                     viewTitle: "Insert Movie",
                    movie: req.body
                });
            } else {
                console.log('Error Ocuure during the Insertion: ' + err);
            }
        }
    });
}


function updateRecord(req, resp) {
    Movie.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function(err, doc) {
        if (!err) { resp.redirect('movie/list'); } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                resp.render("movie/addOrEdit", {
                    viewTitle: "Insert Movie",
                    movie: req.body
                });
            } else {
                console.log('Error Ocuure during the Insertion: ' + err);
            }
        }
    });
}

router.get('/list', function(req, resp) {

    Movie.find(function(err, docs) {
        if (!err) {
            resp.render("movie/list", {
                list: docs
            });
        } else {
            console.log('Error Ocuure during the Insertion: ' + err);
        }
    });
});

function handleValidationError(err, body) {

    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'summary':
                body['summaryError'] = err.errors[field].message;
                break;
            default:
                break;
        }

    }
}
router.get('/:id', function(req, resp) {

    Movie.findById(req.params.id, function(err, doc) {
        if (!err) {
            resp.render("movie/addOrEdit", {
                viewTitle: "Update movie",
                movie: doc
            });
        }
    });
});

router.get('/delete/:id', function(req, resp) {
    Movie.findByIdAndRemove(req.params.id, function(err, doc) {
        if (!err) {
            resp.redirect('/movie/list');
        } else {
            console.log('Error Ocuure during the Insertion: ' + err);
        }
    });
});
module.exports = router;
