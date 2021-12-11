'use strict';

const { getAllCategories } = require('../models/postModel');

const get_categories = async (req, res) => {
    const categories = await getAllCategories();
    res.json(categories);
};

module.exports = {
    get_categories,
};