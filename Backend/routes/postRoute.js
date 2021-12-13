'use strict';

const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const { get_all_posts, get_post, upload_post, delete_post, likes_of_post } = require("../controllers/postController");
const router = express.Router();

const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes("image")) {
        cb(null, true)
    } else {
        cb(null, false);
    }
};
const upload = multer({dest: "./uploads/", fileFilter});

router.route('/')
    .get(get_all_posts)
    .post(upload.single('post'),
        body('description').notEmpty(),
        body('category').isNumeric(),
        upload_post);

router.route('/:postId')
    .get(get_post)
    .delete(delete_post)
    .post(likes_of_post);

module.exports = router;