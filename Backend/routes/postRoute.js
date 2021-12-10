'use strict';

const express = require("express");
const { body } = require("express-validator");
const { get_categories, post_post, post_get } = require("../controllers/postController");
const router = express.Router();
const multer = require('multer');

const upload = multer({dest: './uploads/'});

router.route('/')
    .get(get_categories)
    .post(upload.single('post'),
        body('description').notEmpty(),
        body('category').isNumeric(),
        post_post);

router.route('/:postId')
    .get(post_get);
  
// router.route("/:postId")
// .get(get_post)
// .delete(delete_post)

module.exports = router;