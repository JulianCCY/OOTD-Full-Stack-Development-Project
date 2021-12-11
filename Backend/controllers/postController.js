'use strict';

const { getAllCategories, insertPost } = require('../models/postModel');
const { httpError } = require('../utils/errors');
const { validationResult } = require("express-validator");
// const { makeThumbnail } = require('../utils/resize');
// const { getCoordinates } = require('../utils/imageMeta');

const get_categories = async (req, res) => {
    const categories = await getAllCategories();
    console.log("all categories", categories);
    res.json(categories);
};

const post_get = async (req, res, next) => {
    const post = await get(req.params.postId, next)
    if (post) {
        res.json({post});
        return;
    }
    const err = httpError("Post not found", 404);
    next(err);
};

const post_post = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Post image validation: ', errors.array());
        const err = httpError("Posting data not valid", 400);
        next(err);
        return;
    }

    console.log("add post data", req.body);
    console.log("Posting images", req.file);

    if (!req.file) {
        const err = httpError('Invalid file', 400);
        next(err);
        return;
    }

    try {
        const post = req.body;
        const user_id = req.user.user_id;
        const id = await insertPost(post, user_id);
        res.json({message: `post created with id: ${id}`, post_id: id});

    } catch (e) {
        console.log("post_post error", e.message);
        const err = httpError("Error uploading post", 400);
        next(err);
        return;
    }
}

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
    post_post,
    post_get,
};