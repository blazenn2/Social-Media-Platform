const { validationResult } = require('express-validator');
const post = require('../models/post');
const path = require('path');
const fs = require('fs');

// <=========================== GET ALL POSTS FROM DB ===========================> //
exports.getPosts = async (req, res, next) => {
  try {
    const getPosts = await post.find();
    if (getPosts) res.status(200).json({
      message: 'Fetched posts successfully',
      posts: getPosts
    });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
};

// <=========================== POST NEW FEED POSTS TO DB ===========================> //
exports.createPost = async (req, res, next) => {
  try {
    // -------------- SERVER SIDE VALIDATION OF INPUT -------------- //
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = { errors: errors.array(), message: "Validation failed, entered data is incorrect.", statusCode: 422 };
      next(err);
    }

    if (!req.file) {
      const err = { message: "No image provided.", statusCode: 422 };
      next(err);
    }

    // -------------- INSERTING POST TO DATABASE -------------- //
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\", "/");

    const createPost = await post({ title: title, content: content, imageUrl: imageUrl, creator: { name: 'Maximilian' } }).save();
    if (createPost) return res.status(201).json({
      message: 'Post created successfully!',
      post: createPost
    });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const getPost = await post.findById(postId);
    if (!getPost) {
      const error = new Error(`Couldn't find post.`);
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      message: 'Post fetched successfully',
      post: getPost
    })
  } catch (err) {
    next(err);
  }
};


exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    let imageUrl = req.body.image;
    if (req.file) imageUrl = req.file.path;
    if (!imageUrl) {
      const error = new Error("No file picked");
      error.statusCode = 422;
      throw error;
    }
    const getPost = await post.findById(postId);
    if (!getPost) {
      const error = new Error(`Couldn't find post.`);
      error.statusCode = 404;
      throw error;
    }
    console.log(req.body.imageUrl);
    getPost.title = req.body.title;
    getPost.content = req.body.content;
    if (imageUrl !== getPost.imageUrl) clearImage(getPost.imageUrl);
    getPost.imageUrl = imageUrl;
    return getPost.save();
  } catch (err) {
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '../', filePath);
  fs.unlink(filePath, err => console.log(err));
};
