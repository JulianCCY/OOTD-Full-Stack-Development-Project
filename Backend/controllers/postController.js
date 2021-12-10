'use strict';

const { getAllCategories } = require('../models/postModel');
const { httpError } = require('../utils/errors');
const { validationResult } = require("express-validator");
// const { makeThumbnail } = require('../utils/resize');
// const { getCoordinates } = require('../utils/imageMeta');

const get_categories = async (req, res) => {
    const categories = await getAllCategories();
    console.log("all categories", categories);
    res.json(categories);
  };

// const cat_get = async (req, res, next) => {
//     const cat = await getCat(req.params.catId, next)
//     if (cat) {
//         res.json({cat});
//         return;
//     }
//     const err = httpError("Cat not found", 404);
//     next(err);
// };

// const cat_post = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const err = httpError("Data not valid", 400);
//         next(err);
//         return;
//     }
//     console.log("add cat data", req.body);
//     console.log("filename", req.file);

//     try {
//         const coords = await getCoordinates(req.file.path);
//         console.log("coords", coords);
//         req.body.coords = JSON.stringify(coords);
//     } catch (e) {
//         req.body.coords = "[24.74,60.24]";
//     }

//     try {
//         const thumb = await makeThumbnail(req.file.path, req.file.params);
//         const cat = req.body;
//         cat.filename = req.file.filename;
//         cat.owner = req.user.user_id;
//         const id = await insertCat(cat);
//         if (thumb) {
//             res.json({message: `Cat created with id: ${id}`, cat_id: id});
//         }
//     } catch (e) {
//         console.log("cat_post error", e.message);
//         const err = httpError("Error uploading cat", 400);
//         next(err);
//         return;
//     }
// }

// const cat_delete = async (req, res) => {
//     const deleted = await deleteCat(req.params.catId, req.user.user_id, req.user.role);
//     res.json({message: `Cat deleted: ${deleted}`});
// }

// const cat_update = async (req, res) => {
//     req.body.id = req.params.catId;
//     req.body.owner = req.body.owner || req.user.user_id;
//     req.body.role = req.user.role;
//     const updated = await updateCat(req.body);
//     // res.send(`Cat updated: ${updated}`);
//     res.json({message: `Cat updated: ${updated}`});
// }

module.exports = {
    get_categories,
};