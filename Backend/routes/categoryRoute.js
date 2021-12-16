'use strict';

const express = require("express");

const { get_categories, get_all_posts_by_category } = require("../controllers/categoryController");
const router = express.Router();

router.route('/')
    .get(get_categories)

router.route('/:categoryId')
    .get(get_all_posts_by_category)

module.exports = router;