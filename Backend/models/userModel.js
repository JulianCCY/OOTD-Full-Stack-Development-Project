'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();
var bcrypt = require('bcryptjs');
  
  //Get user info by getting the username during login
  const getUserLogin = async (params) => {
    try {
      console.log(params);
      const [rows] = await promisePool.execute('SELECT * FROM ootd_user WHERE username = ?;', params);
      return rows;
    } catch (e) {
      console.log('error', e.message);
    }
  }

  //show the details of user info
  const getUser = async (userId) => {
    try{
      const [rows] = await promisePool.execute('SELECT ootd_user.user_id, username, email, password, role, profile, profile_pic, COUNT(user_post.user_id) AS numOfOwnedPosts,(SELECT COUNT(*) FROM user_post INNER JOIN post_likes ON user_post.post_id = post_likes.post_id WHERE user_post.user_id = ?) AS totalNumOfLikes FROM ootd_user INNER JOIN user_post ON ootd_user.user_id = user_post.user_id WHERE ootd_user.user_id = ?;', [userId, userId]);
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
  
  //Create new user account after validation check
  const insertUser = async (user) => {
    try {
      const [rows] = await promisePool.execute(`INSERT INTO ootd_user (username, email, password) VALUES (?,?,?)`, 
      [user.username, user.email, user.passwd]);
      return rows.insertId;
    } catch (e) {
      console.error("insert error", e.message);
    }
  };

  const updateUserProPic = async (user, userId) => {
    try {
      const [rows] = await promisePool.execute('UPDATE ootd_user SET profile_pic = ? WHERE user_id = ?', [user.profile_pic, userId]);
      return rows.affectedRows === 1;
    } catch (e) {
      console.error('model update user profile picture', e.message);
    }
  };
  
  //Update user profile(name, email, password, description)
  const updateUser = async (user, userId) => {
    const hashPassword = await bcrypt.hash(user.passwd, 12);
    
    try {
      if (user.username === "") {
        if (user.email === "") {
          const [rows] = await promisePool.execute('UPDATE ootd_user SET password = ?, profile = ? WHERE user_id = ?', [hashPassword, user.profile, userId]);
          return rows.affectedRows === 1;
        }
        if (user.profile === "") {
          const [rows] = await promisePool.execute('UPDATE ootd_user SET email = ?, password = ? WHERE user_id = ?', [user.email, hashPassword, userId]);
          return rows.affectedRows === 1;
        }
        if (user.email === "" && user.profile === "") {
          const [rows] = await promisePool.execute('UPDATE ootd_user SET password = ? WHERE user_id = ?', [hashPassword, userId]);
          return rows.affectedRows === 1;
        }
        else {
          const [rows] = await promisePool.execute('UPDATE ootd_user SET  email = ?, password = ?, profile = ? WHERE user_id = ?', [user.email, hashPassword, user.profile, userId]);
          return rows.affectedRows === 1;
        }
      }
      if (user.email === "") {
        if (user.username === "") {
          const [rows] = await promisePool.execute('UPDATE ootd_user SET password = ?, profile = ? WHERE user_id = ?', [hashPassword, user.profile, userId]);
          return rows.affectedRows === 1;
        }
        if (user.profile === "") {
          const [rows] = await promisePool.execute('UPDATE ootd_user SET username = ?, password = ? WHERE user_id = ?', [user.username, hashPassword, userId]);
          return rows.affectedRows === 1;
        }
        else {
          const [rows] = await promisePool.execute('UPDATE ootd_user SET username = ?, password = ?, profile = ? WHERE user_id = ?', [user.username, hashPassword, user.profile, userId]);
          return rows.affectedRows === 1;
        }
      }
      if (user.profile === "") {
        const [rows] = await promisePool.execute('UPDATE ootd_user SET username = ?, email = ?, password = ? WHERE user_id = ?', [user.username, user.email, hashPassword, userId]);
        return rows.affectedRows === 1;
      }
    } catch (e) {
      console.error('model update user info', e.message);
    }
  }

  //Check if username is unique for register
  const checkUsername = async (user) => {
    try {
      const [rows] = await promisePool.execute('SELECT COUNT(*) AS duplicate FROM ootd_user WHERE username = ?', [user.username]);
      return rows[0].duplicate;
    } catch (e) {
      console.error('error checking username', e.message);
    }
  }

  //Check if email is unique for register
  const checkEmail = async (user) => {
      try {
        const [rows] = await promisePool.execute('SELECT COUNT(*) AS duplicate FROM ootd_user WHERE email = ?', [user.email]);
        console.log(rows[0])
        return rows[0].duplicate;
      } catch (e) {
        console.error('error checking email', e.message);
      }
  }

  //idk this sql, bcrypt not allow (Later)
  const checkPassword = async (user, userId) => {
    const hashOldPassword = await bcrypt.hash(user.oldpasswd, 12);

    try {
      const [rows] = promisePool.execute('SELECT COUNT(*) AS currentPassword FROM ootd_user WHERE user_id = ?, password = ?', [userId, hashOldPassword]);
      return rows.affectedRows === 1;
    } catch (e) {
      console.error('error checking password', e.message);
    }
  }

  //Get detail of every post and check if curent login user liked the post or not for frontend purpose
  const getUserPosts = async (userId) => {
    try {
      const [rows] = await promisePool.query('SELECT user_post.post_id, ootd_user.username, ootd_user.profile_pic, image, description, categories.cid, categories.category, COUNT(post_likes.post_id) AS likes, (SELECT COUNT(*) FROM post_likes WHERE user_id = ? AND post_id = user_post.post_id) as liked, upload_time, time_stamp FROM user_post INNER JOIN ootd_user ON user_post.user_id = ootd_user.user_id JOIN categories ON user_post.category = categories.cid LEFT JOIN post_likes ON user_post.post_id = post_likes.post_id WHERE ootd_user.user_id = ? GROUP BY user_post.post_id ORDER BY user_post.upload_time DESC;', [userId, userId]);
      return rows;
    } catch (e) {
      console.error('error getting all posts', e.message);
    };
  }

  //Delete user account
  const deleteUser = async (userId) => {
    let sql1 = 'Delete from post_likes where user_id = ?;';
    let sql2 = 'Delete from user_post where user_id = ?;';
    let sql3 = 'Delete from ootd_user Where user_id = ?;';
    let params = [userId];

    try{
      const[rows1] = await promisePool.execute(sql1, params);
      const[rows2] = await promisePool.execute(sql2, params);
      const[rows3] = await promisePool.execute(sql3, params);
      return rows1.affectedRows === 1, rows2.affectedRows === 1, rows3.affectedRows === 1;
    } catch (e) {
      console.error('error deleting post in model', e.message);
    }
  };
  
  module.exports = {
    getUserLogin,
    getUser,
    getAllUsers,
    insertUser,
    deleteUser,
    updateUserProPic,
    updateUser,
    checkUsername,
    checkEmail,
    getUserPosts,
  };