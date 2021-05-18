const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const methodOverride = require('method-override');
const path = require('path');
const db = require("./src/model");
const Role = db.role;

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

var cookieParser = require('cookie-parser')

const mongoose = require('mongoose');
(async () => {
    try {
        await mongoose.connect('mongodb://localhost/solicitudes_db',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        console.log('Connected to Mongo!')
        initial();
    } catch (err) {
        console.log('Error connecting to Database: ' + err)
    }
})()

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}

app.use(cors(corsOptions));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

require('./src/routes/auth')(app);
require('./src/routes/user')(app);
require('./src/routes/approutes')(app);


// handle 404 errors
app.use(function(req, res){
    res.status(404).render('notFound');
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).render('error', { error: err});
});

const port = parseInt(process.env.PORT || '8001', 10);
app.listen(port, function() {
    console.log('App listening on port: ' + 8001);
});
