const { validationResult } = require('express-validator');
const post = require('../models/post');

// <=========================== GET ALL POSTS FROM DB ===========================> //
exports.getPosts = async (req, res, next) => {
  try {
    const getPosts = await post.find();
    if (getPosts) res.status(200).json({
      posts: getPosts
    });
  } catch (err) {
    console.log(err);
  }
};

// <=========================== POST NEW FEED POSTS TO DB ===========================> //
exports.createPost = async (req, res, next) => {
  try {

    // -------------- SERVER SIDE VALIDATION OF INPUT -------------- //
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error({ errors: errors.array(), message: "Validation failed, entered data is incorrect." });
      // return res.status(422).json({ errors: errors.array(), message: "Validation failed, entered data is incorrect." });
    }

    // -------------- INSERTING POST TO DATABASE -------------- //
    const title = req.body.title;
    const content = req.body.content;

    const createPost = await post({ title: title, content: content, imageUrl: 'images/duck.jpg', creator: { name: 'Maximilian' } }).save();
    if (createPost) return res.status(201).json({
      message: 'Post created successfully!',
      post: createPost
    });
  } catch (err) {
    console.log(err);
  }
};
