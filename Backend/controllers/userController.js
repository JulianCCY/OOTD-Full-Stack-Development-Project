'use strict';
const { getAllUsers, getUser, updateUserProPic, updateUser } = require("../models/userModel");
const { httpError } = require("../utils/errors");
const { body, validationResult } = require('express-validator');
const pool = require('../database/db');
const promisePool = pool.promise();

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

const user_get = async (req, res) => {
    const user = await getUser(req.params.userId);
    await delete user.password;
    res.json(user);
};

const user_delete = async (req, res)=>{
    const deleted = await deleteUser(req.params.userId);
    res.json({message: `User deleted: ${deleted}`});
};


const userProPic_update = async (req, res)=>{
    const proPic_update = await updateUserProPic(req.body);
    res.json({message: `User profile picture updated: ${proPic_update}`});
}

const user_update = async (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Post image validation: ', errors.array());
        const err = httpError("Posting data not valid", 400);
        next(err);
        return;
    }

    const userId = req.params.userId;

    const[checkUsername] = await promisePool.execute('SELECT COUNT(*) FROM ootd_user WHERE user_id = ?', [userId]);
    if (checkUsername != 0){
        res.json({message: 'Username already in used'});
        return;
    }

    const updated = await updateUser(req.body, userId);
    if (updated) {
        res.json({ message: `Update successfully: ${updated}` });
        return;
    }else{
        res.json({ message: 'Error updating user' });
        return;
    }
}

module.exports = {
    user_list_get,
    user_get,
    user_delete,
    user_update,
    userProPic_update,
    checkToken,
}

