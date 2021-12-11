'use strict';

const express = require("express");

const { get_categories } = require("../controllers/categoryController");
const router = express.Router();

router.route('/')
    .get(get_categories)

module.exports = router;