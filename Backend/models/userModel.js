'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

  const getUserLogin = async (params) => {
    try {
      console.log(params);
      const [rows] = await promisePool.execute('SELECT * FROM ootd_user WHERE username = ?;', params);
      return rows;
    } catch (e) {
      console.log('error', e.message);
    }
  }

  const getUser = async (userId) => {
    try{
      const [rows] = await promisePool.execute('SELECT * FROM ootd_user WHERE user_id = ?', [userId]);
      return rows;
    } catch (e) {
      console.error('model get user by ID', e.message);
    }
  };

  const getAllUsers = async () => {
    //all async will return a promise
    try {
      // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
      const [rows] = await promisePool.query('SELECT * FROM ootd_user WHERE role > 0');
      return rows;
    } catch (e) {
      console.error("get all users error", e.message);
    };
  };
  
  
  const insertUser = async (user) => {
    try {
      const [rows] = await promisePool.execute(`INSERT INTO ootd_user (username, email, password) VALUES (?,?,?)`, 
      [user.username, user.email, user.passwd]);
      return rows.insertId;
    } catch (e) {
      console.error("insert error", e.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const [rows] = await promisePool.execute('DELETE FROM ootd_user WHERE user_id = ?', [userId]);
      console.log("Delete user account", rows)
      return rows.affectedRows === 1;
    } catch (e) {
      console.error("model delete user", e.message);
    }
  };

  const updateUserProPic = async (user) => {
    try {
      const [rows] = await promisePool.execute('UPDATE ootd_user SET profile_pic = ? WHERE user_id = ?',[user.profilePicture, user.userId]);
      return rows.affectedRows === 1;
    } catch (e) {
      console.error('model update user profile picture', e.message);
    }
  };

  const updateUser = async (user) => {
    try {
      const [rows] = await promisePool.execute('UPDATE ootd_user SET username = ?, email = ?, password = ?, profile = ? WHERE user_id = ?',
      [user.username, user.email, user.passwd, user.profile, user.userId]);
      return rows.affectedRows === 1;
    } catch (e) {
      console.error('model update user info', e.message);
    }
  }
  
  module.exports = {
    getUserLogin,
    getUser,
    getAllUsers,
    insertUser,
    deleteUser,
    updateUserProPic,
    updateUser,
  };