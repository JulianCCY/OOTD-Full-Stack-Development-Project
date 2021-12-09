'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute.js');
const { httpError } = require('./utils/errors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());// for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// app.use(passport.initialize());
app.use('/auth', authRoute);

//Handling error
// app.use((req, res, next)=>{
//     const err = httpError('Not Found', 404);
// });

//error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({message: err.message || "internal error"});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));