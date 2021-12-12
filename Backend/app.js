'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const authRoute = require('./routes/authRoute.js');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');

const { httpError } = require('./utils/errors');
const passport = require('./utils/pass');

var bcrypt = require('bcryptjs');


app.use(cors());
app.use(express.json());// for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(passport.initialize());

app.use(express.static('uploads'));
app.use("/thumbnails",express.static("thumbnails"));

app.use('/auth', authRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
app.use('/post', passport.authenticate('jwt', {session: false}), postRoute);
app.use('/category', passport.authenticate('jwt', {session: false}), categoryRoute);


app.get('/', async(req, res) => {
      res.send(await bcrypt.hash('admin', 12));
});


//Handling error
app.use((req, res, next)=>{
    const err = httpError('Not Found', 404);
    next(err);
});

//error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({message: err.message || "internal error"});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));