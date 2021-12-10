'use strict';
const {getUserLogin, getAllUsers, insertUser} = require("../models/userModel");
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

const user_update = async(req, res)=>{
    const update = await updateUser(req.body)
    // res.send(`at updated: ${update}`);
    res.json({message: `User updated: ${update}`});
}

module.exports = {
    user_list_get,
    user_get,
    user_delete,
    user_update,
    checkToken,
}

