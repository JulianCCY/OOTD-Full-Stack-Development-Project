'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllCategories = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM categories');
    return rows;
  } catch (e) {
    console.error('error getting all categories', e.message);
  }
}

const getAllPosts = async () => {
    //all async will return a promise
    try {
      // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
      const [rows] = await promisePool.query('SELECT post_id, ootd_user.username, image, description, categories.cid, categories.category FROM user_post INNER JOIN ootd_user ON user_post.user_id = ootd_user.user_id JOIN categories ON user_post.category = categories.cid ;');
      return rows;
    } catch (e) {
      console.error('error', e.message);
      const err = httpError('Sql error', 500);
    };
};

const getPost = async(postId, next) => {
    //git push origin database
    try{
        //const[rows] = await promisePool.query(`SELECT * FROM wop_cat WHERE cat_id=${catId}`);
        const[rows] = await promisePool.execute('SELECT post_id, ootd_user.username, image, description, categories.cid, categories.category FROM user_post INNER JOIN ootd_user ON user_post.user_id = ootd_user.user_id JOIN categories ON user_post.category = categories.cid WHERE post_id = ?;', [postId]);
        console.log('get by id result', rows);
        return rows[0];
    } catch (e){
      const err = httpError('Sql error', 500);
      next(err);
    }
};
  
//user id ????????
const insertPost = async (post) =>{
    try{
      const[rows] = await promisePool.execute('INSERT INTO user_post (user_id, image, description, category) VALUES (?,?,?,?)', 
      [post.user_id, post.image, post.description, post.category]);
      console.log('model insert post', rows);
      return rows.insertId;
    }catch(e){
      console.error('model insert post', e.message);
    };
};

// const deletePost = async (catId, user_id, role) => {
//     let sql = 'DELETE FROM wop_cat WHERE cat_id = ? AND owner = ?';
//     let params = [catId, user_id];
//     if (role === 0){
//       sql = 'DELETE FROM wop_cat WHERE cat_id = ?';
//       params = [catId];
//     }
//     try {
//       const[rows] = await promisePool.execute(sql, params);
//       return rows.affectedRows === 1;
//     } catch (e) {
//       console.error('model delete cat', e.message);
//     }
// };
  
// const updatePost = async (cat) => {
//     let sql = 'UPDATE wop_cat SET name = ?, weight = ? ,birthdate = ? WHERE cat_id = ? AND owner = ?';
//     let params = [cat.name, cat.weight, cat.birthdate, cat.id, cat.owner];
//     if(cat.role === 0){
//       sql = 'UPDATE wop_cat SET name = ?, weight = ?, owner = ?, birthdate = ? WHERE cat_id = ?';
//       params = [cat.name, cat.weight, cat.owner, cat.birthdate, cat.id]
//     }
//     try {
//       const[rows] = await promisePool.execute(sql,params);
//       return rows.affectedRows === 1;
//     } catch (e) {
//       console.error('model update cat', e.message);
//     };
// };
  

  

module.exports = {
  getAllCategories,
  getAllPosts,
  getPost,
  insertPost,
};
  