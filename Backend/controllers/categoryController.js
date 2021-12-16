'use strict';

const { getAllCategories, getAllPostByCategory } = require('../models/postModel');

const get_categories = async (req, res) => {
    const categories = await getAllCategories();
    res.json(categories);
};

// filter all the post by category id
const get_all_posts_by_category = async (req, res, next) => {
    const posts = await getAllPostByCategory(req.params.categoryId);
    if (posts.length > 0){
        res.json(posts);
    } else {
        res.json({message: "None"});
        // const err = httpError('Posts  not found', 404);
        // next(err)
        // return;
    }
}


module.exports = {
    get_categories,
    get_all_posts_by_category,
};