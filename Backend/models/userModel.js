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
  
  module.exports = {
    getUserLogin,
    getAllUsers,
    insertUser,
  };