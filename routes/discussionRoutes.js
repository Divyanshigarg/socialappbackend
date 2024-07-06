const express = require('express');
const discussionController = require('../controllers/discussionController');
const {checkLogin} = require('../middleware/auth')
const router = express.Router();

router.post('/',checkLogin, discussionController.createDiscussion);
router.put('/:discussionId',checkLogin,discussionController.updateDiscussion)
router.get('/',checkLogin,discussionController.discussions);
router.delete('/:discussionId',checkLogin,discussionController.deleteDiscussion)
router.get('/views',checkLogin,discussionController.getViewCount)

module.exports = router;