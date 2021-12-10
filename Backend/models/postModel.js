'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllPosts = async () => {
    //all async will return a promise
    try {
      // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
      const [rows] = await promisePool.query('');
      return rows;
    } catch (e) {
      console.error('error', e.message);
      const err = httpError('Sql error', 500);
    };
};

// const getPost = async(catId, next) => {
//     //git push origin database
//     try{
//         //const[rows] = await promisePool.query(`SELECT * FROM wop_cat WHERE cat_id=${catId}`);
//         const[rows] = await promisePool.execute('SELECT coords, cat_id, owner, wop_cat.name AS name, weight, birthdate, filename, wop_user.name AS ownername FROM wop_cat INNER JOIN wop_user ON owner = user_id WHERE cat_id = ?', [catId]);
//         console.log('get by id result', rows);
//         return rows[0];
//     } catch (e){
//       const err = httpError('Sql error', 500);
//       next(err);
//     }
// };
  
// const insertPost = async (cat) =>{
//     try{
//       const[rows] = await promisePool.execute('INSERT INTO wop_cat (name, weight, owner, birthdate, filename, coords) VALUES (?,?,?,?,?,?)', 
//       [cat.name, cat.weight, cat.owner, cat.birthdate, cat.filename, cat.coords]);
//       console.log('model insert cat', rows);
//       return rows.insertId;
//     }catch(e){
//       console.error('model insert cat', e.message);
//     };
// };

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
    getAllPosts,
};
  