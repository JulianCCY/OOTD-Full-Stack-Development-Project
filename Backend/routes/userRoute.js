'use strict';
const { body } = require('express-validator');
const express = require('express');
const { checkToken, user_list_get, user_get, user_delete, user_update, updateProPic, user_post_get } = require('../controllers/userController');
const multer = require('multer');
const router = express.Router();

const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes("image")) {
        cb(null, true)
    } else {
        cb(null, false);
    }
};
const uploads = multer({dest: "./uploads", fileFilter});

router.get('/token', checkToken);

router.route('/')
    .get(user_list_get)
    .put(uploads.single("profile_pic"),
    updateProPic)
    .delete(user_delete)

router.route('/:userId')
    .get(user_get)
    .delete(user_delete)
    .put(
        body('username').isLength({ min:3 }).optional({nullable: true, checkFalsy: true}),
        body('email').isEmail().optional({nullable: true, checkFalsy: true}),
        body('passwd').matches('(?=.*?[A-Z])(?=.*?[0-9]).{8,}$'),
        // body('profile').notEmpty(),
        user_update);

router.route('/post/:userId')
        .get(user_post_get)

module.exports = router;