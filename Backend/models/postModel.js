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
    try {
      // const [countlike] = await promisePool.query('');
      const [rows] = await promisePool.query('SELECT post_id, ootd_user.username, ootd_user.profile_pic, image, description, categories.cid, categories.category, COUNT(post_likes.post_id) AS likes FROM user_post INNER JOIN ootd_user ON user_post.user_id = ootd_user.user_id JOIN categories ON user_post.category = categories.cid LEFT JOIN post_likes USING(post_id) GROUP BY post_likes.post_id;');
      return rows;
    } catch (e) {
      console.error('error getting all posts', e.message);
    };
};

const getPost = async(postId, next) => {
    //git push origin database
    try{
        //const[rows] = await promisePool.query(`SELECT * FROM wop_cat WHERE cat_id=${catId}`);
        const[rows] = await promisePool.execute('SELECT post_id, ootd_user.username, ootd_user.profile_pic, image, description, categories.cid, categories.category, COUNT(post_likes.post_id) AS likes FROM user_post INNER JOIN ootd_user ON user_post.user_id = ootd_user.user_id JOIN categories ON user_post.category = categories.cid LEFT JOIN post_likes USING(post_id) WHERE post_id = ? GROUP BY post_likes.post_id;', [postId]);
        return rows[0];
    } catch (e){
      console.log('error getting post', e.message);
      const err = httpError('Sql error', 500);
      next(err);
    }
};

const deletePost = async (postId, user_id, role) => {
  let sql = 'DELETE FROM user_post WHERE post_id = ? AND user_id = ?';
  let params = [postId, user_id];
  if (role === 0){
    sql = 'DELETE FROM user_post WHERE post_id = ?';
    params = [postId];
  }
  try {
    const[rows] = await promisePool.execute(sql, params);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('error deleteing post in model', e.message);
  }
};

const getLikeOfPost = async (postId) => {
  try {
    const [rows] = await promisePool.execute('SELECT COUNT (*) as likes FROM post_likes WHERE post_id = ?', [postId]);
    return rows;
  } catch (e){
    console.log('error getting likes of post', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
}
  
const insertPost = async (post) =>{
    try{
      const[rows] = await promisePool.execute('INSERT INTO user_post (user_id, image, description, category) VALUES (?,?,?,?)', 
      [post.userId, post.filename, post.description, post.category]);
      console.log('model insert post', rows);
      return rows.insertId;
    }catch(e){
      console.error('model insert post', e.message);
      const err = httpError('Sql error', 500);
      next(err);
    };
};


const insertLike = async (userId, postId, next) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO post_likes (user_id, post_id) VALUES (?,?)', [userId, postId]);
    console.log('Give a like to post', rows);
  } catch (e){
    console.error('model add likes', e.message);
    const err = httpError('Sql error', 500);
    next(err);
  }
}

const deleteLike = async (userId, postId) => {
  let sql = 'DELETE FROM post_likes WHERE user_id = ? AND post_id = ?';
  let params = [userId, postId];
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows.affectedRows === 1;
  } catch (e){
    console.error('model delete like', e.message);
  }
}
  
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
  deletePost,
  getLikeOfPost,
  insertPost,
  insertLike,
  deleteLike,
};
  