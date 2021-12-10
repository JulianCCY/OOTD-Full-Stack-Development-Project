'use strict';

const express = require("express");
const { body } = require("express-validator");
const { get_categories } = require("../controllers/postController");
const router = express.Router();

router.route("/")
.get(get_categories)
  
// router.route("/:postId")
// .get(get_post)
// .delete(delete_post)

module.exports = router;