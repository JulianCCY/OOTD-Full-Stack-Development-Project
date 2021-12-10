'use strict';
const { body } = require('express-validator');
const express = require('express');
const {user_list_get, user_get, user_delete, user_update, checkToken} = require('../controllers/userController')
const router = express.Router();

router.get('/token', checkToken);

router.route('/')
    .get(user_list_get)
    .put(user_update);

router.route('/:userId')
    .get(user_get)
    .delete(user_delete)

module.exports = router;