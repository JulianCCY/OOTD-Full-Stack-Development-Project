'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
var bcrypt = require('bcryptjs');

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

  const updateUser = async (user, userId) => {
    const hashPassword = await bcrypt.hash(user.passwd, 12);
    try {
      const [rows] = await promisePool.execute('UPDATE ootd_user SET username = ?, email = ?, password = ?, profile = ? WHERE user_id = ?', [user.username, user.email, hashPassword, user.profile, userId]);
      return rows.affectedRows === 1;
    } catch (e) {
      console.error('model update user info', e.message);
    }
  }

  const checkUsername = async (user) => {
    try {
      const [rows] = await promisePool.execute('SELECT COUNT(*) AS duplicate FROM ootd_user WHERE username = ?', [user.username]);
      return rows[0].duplicate;
    } catch (e) {
      console.error("error checking username", e.message);
    }
  }

  //idk this sql
  const checkPassword = async (user, userId) => {
    try {
      const [rows] = promisePool.execute('SELECT COUNT(*) AS password FROM ootd_user WHERE username = ?, password = ?', [userId, user.oldpasswd]);
      return rows.affectedRows === 1;
    } catch (e) {
      console.error('error checking password', e.message);
    }
  }

  const getUserPosts = async (userId) => {
    try {
      const [rows] = await promisePool.query('SELECT user_post.post_id, ootd_user.username, ootd_user.profile_pic, image, description, categories.cid, categories.category, COUNT(post_likes.post_id) AS likes, (SELECT COUNT(*) FROM post_likes WHERE user_id = ? AND post_id = user_post.post_id) as liked, upload_time, time_stamp FROM user_post INNER JOIN ootd_user ON user_post.user_id = ootd_user.user_id JOIN categories ON user_post.category = categories.cid LEFT JOIN post_likes ON user_post.post_id = post_likes.post_id GROUP BY user_post.post_id ORDER BY user_post.upload_time DESC;', [userId]);
      return rows;
    } catch (e) {
      console.error('error getting all posts', e.message);
    };
  }
  
  module.exports = {
    getUserLogin,
    getUser,
    getAllUsers,
    insertUser,
    deleteUser,
    updateUserProPic,
    updateUser,
    checkUsername,
    getUserPosts,
  };