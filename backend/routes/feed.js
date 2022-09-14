const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const tokenVerification = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', tokenVerification, feedController.getPosts);

// POST /feed/post
router.post('/post', tokenVerification, [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })], feedController.createPost);

// GET /feed/post/:postId
router.get('/post/:postId', tokenVerification, feedController.getPost);

// PUT /feed/post/:postId
router.put('/post/:postId', tokenVerification, [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })], feedController.updatePost);

// DELETE /feed/post/:postId
router.delete('/post/:postId', tokenVerification, feedController.deletePost);

module.exports = router;