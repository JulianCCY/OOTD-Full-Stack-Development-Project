'use strict';

const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes("image")) {
        cb(null, true)
    } else {
        cb(null, false);
    }
};
const upload = multer({dest: "./uploads/", fileFilter});
const { get_all_posts, get_post, upload_post } = require("../controllers/postController");
const router = express.Router();

router.route('/')
    .get(get_all_posts)
    .post(upload.single('post'),
        body('description').notEmpty(),
        body('category').isNumeric(),
        upload_post);

router.route('/:postId')
    .get(get_post);

module.exports = router;