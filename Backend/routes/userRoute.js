'use strict';
const { body } = require('express-validator');
const express = require('express');
const {user_list_get, user_delete, user_update, checkToken, user_get} = require('../controllers/userController');
const multer = require('multer');
const router = express.Router();

const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes("image")) {
        cb(null, true)
    } else {
        cb(null, false);
    }
};
const uploadProPic = multer({dest: "./uploadProPic/", fileFilter});

router.get('/token', checkToken);

router.route('/')
    .get(user_list_get)

router.route('/:userId')
    .get(user_get)
    .delete(user_delete)
    .put(
        body('username').isLength({ min:3}),
        body('email').isEmail(),
        body('passwd').matches('(?=.*[A-Z]).{8,}'),
        body('profile').notEmpty(),
        user_update);

module.exports = router;