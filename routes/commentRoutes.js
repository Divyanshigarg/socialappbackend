const express = require('express');
const commentController = require('../controllers/commentController');
const {checkLogin} = require('../middleware/auth')
const router = express.Router();

router.post('/like',checkLogin,commentController.likePost)
router.post('/commentLike',checkLogin,commentController.likeComment)
router.post('/:discussionId',checkLogin, commentController.addComment);
router.put('/:commentId',checkLogin,commentController.updateComment)
router.delete('/:commentId',checkLogin,commentController.deleteComment)
router.post('/reply/:commentId',checkLogin,commentController.replyToComment)

module.exports = router;