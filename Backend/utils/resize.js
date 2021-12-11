'use strict';
const sharp = require('sharp');

const makePostPhoto = async (file, thumbname) => {
    return await sharp(file)
        .resize(160, 160)
        .toFile('./thumbnails/' + thumbname);
};

module.exports = {
    makePostPhoto,
};