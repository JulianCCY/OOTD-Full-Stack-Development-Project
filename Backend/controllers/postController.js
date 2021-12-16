'use strict';

const { getAllPosts, getPost, insertPost, deletePost, manageLikes, getAllPostByCategory } = require('../models/postModel');
const { httpError } = require('../utils/errors');
const { validationResult } = require("express-validator");
const { makePostPhoto } = require('../utils/resize');

// get all the posts from usermodel with checking likes by user id
const get_all_posts = async (req, res, next) => {
    const posts = await getAllPosts(req.user.user_id);
    if (posts.length > 0) {
        res.json(posts);
    } else {
        const err = httpError("Posts not found", 404);
        next(err);
        return;
    }
  };

// filter all the post by category id
const get_all_posts_by_category = async (req, res, next) => {
    const posts = await getAllPostByCategory(req.params.category);
    if (posts.length > 0){
        res.json(posts);
    } else {
        const err = httpError('Posts  not found', 404);
        next(err)
        return;
    }
}

// get info of a single post with post id
const get_post = async (req, res, next) => {
    const post = await getPost(req.params.postId, next)
    if (post) {
        res.json({post});
        return;
    }
    const err = httpError("Posts not found", 404);
    next(err);
};

// upload a single post with user id, filename and validation check
const upload_post = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Post image validation: ', errors.array());
        const err = httpError("Posting data not valid", 400);
        next(err);
        return;
    }

    console.log("upload post data", req.body);
    console.log("filename", req.file);

    if (!req.file) {
        const err = httpError('Invalid file', 400);
        next(err);
        return;
    }

    try {
        const thumb = await makePostPhoto(req.file.path, req.file.filename);
        console.log('Try thumb', req.file);
        const post = req.body;
        post.filename = req.file.filename;
        post.userId = req.user.user_id;
        const id = await insertPost(post);
        console.log('Try insert', req.file);
        if (thumb){
            console.log('After insert', req.file);
            res.json({message: `Your post has been uploaded with id: ${id}`, post_id: id});
            return;
        }
    } catch (e) {
        console.log("upload post error", e.message);
        const err = httpError("Error uploading post", 400);
        next(err);
        return;
    }
}

// delete post with post id, user id, and admin role (0)
const delete_post = async (req, res) => {
    const deleted = await deletePost(req.params.postId, req.user.user_id, req.user.role);
    res.json({message: `Post with id: ${deleted} has been deleted.`});
}

// Add or remove likes of posts with post id and user id
const likes_of_post = async (req, res) =>{
    const likes = await manageLikes(req.user.user_id, req.params.postId);
    res.json({message: `Modified likes. ${likes}`});
}

module.exports = {
    get_all_posts,
    get_all_posts_by_category,
    get_post,
    upload_post,
    delete_post,
    likes_of_post,
};