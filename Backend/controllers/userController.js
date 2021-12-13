'use strict';
const {getUserLogin, getAllUsers, insertUser, updateUser, updateUserProPic} = require("../models/userModel");
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
    // const newUsers = users.map((user)=>{
    //     delete user.password
    //     return user;
    // });
    const newUsers = await getAllUsers();
    await newUsers.forEach((user) => delete user.password);
    
    const filterAdmin = newUsers.filter(user => user.role > 0);
    res.json(filterAdmin);
};

const user_get = async(req, res) => {
    const user = await getUser(req.params.userId);
    await delete user.password;
    res.json(user);
};

const user_delete = async(req, res)=>{
    const deleted = await deleteUser(req.params.userId);
    res.json({message: `User deleted: ${deleted}`});
};


const userProPic_update = async(req, res)=>{
    const proPic_update = await updateUserProPic(req.body);
    res.json({message: `User profile picture updated: ${proPic_update}`});
}

const user_update = async(req, res)=>{
    const update = await updateUser(req.body);
    res.send(`at updated: ${update}`);
    res.json({message: `User updated: ${update}`});
}

module.exports = {
    user_list_get,
    user_get,
    user_delete,
    user_update,
    checkToken,
    userProPic_update,
    user_update,
}

