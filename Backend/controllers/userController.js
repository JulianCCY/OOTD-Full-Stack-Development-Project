'use strict';
const { getAllUsers, getUser, updateUserProPic, updateUser, checkUsername, getUserPosts, checkEmail, deleteUser} = require("../models/userModel");
const { httpError } = require("../utils/errors");
const { body, validationResult } = require('express-validator');

// userController.js
const checkToken = (req, res, next) => {
    if (!req.user) {
      next(new Error('token not valid'));
    } else {
      res.json({ user: req.user });
    }
};

const user_list_get = async (req, res) => {
    const newUsers = await getAllUsers();
    await newUsers.forEach((user) => delete user.password);
    res.json(newUsers);
    // const filterAdmin = newUsers.filter(user => user.role > 0);
    // res.json(filterAdmin);
};

const user_get = async (req, res) => {
    const user = await getUser(req.params.userId);
    await delete user.passwd;
    res.json(user);
};

const user_delete = async (req, res)=>{
    const deleted = await deleteUser(req.params.userId);
    res.json({message: `User deleted: ${deleted}`});
};

const user_update = async (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            message: `Register Invalid \nInput value does not match requirement`,
            status: "invalid",
        });
        return;
    }
    const check_Username = await checkUsername(req.body);
    if (check_Username === 1) {
        res.json({
            message: 'Username already in used.',
            status: "username",
          });
        return;
    }

    const check_Email = await checkEmail(req.body);
    if (check_Email === 1) {
        res.json({
            message: 'Email already in used.',
            status: "email",
        });
        return;
    }

    const updated = await updateUser(req.body, req.params.userId);
        if (updated) {
            res.json({ message: `Update successfully: ${updated}`,
            status: "good",
            });
        } else{
            res.json({ message: 'Error updating user' });
            return;
        }
}

const updateProPic = async (req, res) => {
    try {
        const proPic_update = await updateUserProPic(req.file, req.user.user_id);
        res.json({message: `User profile picture updated: ${proPic_update}`});
    } catch (e) {
        console.log("error uploading avatar", e.message);
    }
    
}

const user_post_get = async (req, res, next) => {
    const posts = await getUserPosts(req.params.userId, req.user.user_id);
    if (posts.length > 0) {
        res.json(posts);
    } else {
        const err = httpError("Posts not found", 404);
        next(err);
        return;
    }
};

module.exports = {
    user_list_get,
    user_get,
    user_delete,
    user_update,
    updateProPic,
    user_post_get,
    checkToken,
}

