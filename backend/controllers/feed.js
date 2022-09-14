const { validationResult } = require('express-validator');
const post = require('../models/post');
const path = require('path');
const fs = require('fs');

// <=========================== GET ALL POSTS FROM DB ===========================> //
exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const postPerPage = 2;
    const totalPost = await post.countDocuments();
    const getPosts = await post.find().skip((currentPage - 1) * postPerPage).limit(postPerPage);
    if (getPosts) res.status(200).json({
      message: 'Fetched posts successfully',
      posts: getPosts,
      totalItems: totalPost
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
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    if (!req.file) {
      const error = new Error("No image provided.");
      error.statusCode = 422;
      throw error;
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
    getPost.title = req.body.title;
    getPost.content = req.body.content;
    if (imageUrl !== getPost.imageUrl) clearImage(getPost.imageUrl);
    getPost.imageUrl = imageUrl;
    return getPost.save();
  } catch (err) {
    next(err);
  }
};


exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const getPost = await post.findById(postId);
    if (!getPost) {
      const error = new Error(`Couldn't find post.`);
      error.statusCode = 404;
      throw error;
    } else {
      const deletedPost = await post.findByIdAndRemove(postId);
      clearImage(getPost.imageUrl);
      console.log(deletedPost);
      return res.status(200).json({ message: "Deleted post successfully", });
    }
  } catch (err) {
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '../', filePath);
  fs.unlink(filePath, err => console.log(err));
};
