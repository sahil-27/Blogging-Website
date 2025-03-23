const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyAuth = require('../middleware/verify-auth');
const PostController = require('../controllers/posts');
const extractFile = require('../middleware/file-check');

router.post("", verifyAuth, extractFile, PostController.createPost);

router.put('/:id', verifyAuth, extractFile, PostController.editPost);

router.get('', PostController.GetPosts);

router.get('/:id', PostController.getSinglePost);

router.delete('/:id', verifyAuth, PostController.DeletePost);

module.exports = router;