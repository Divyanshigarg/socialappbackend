const express = require('express');
const userController = require('../controllers/userController');
const {checkLogin} = require('../middleware/auth')
const router = express.Router();

router.post('/', userController.registerUser);
router.post('/login',userController.login)
router.put('/:userId',checkLogin,userController.updateUser)
router.get('/:userId',checkLogin,userController.getUser);
router.get('/',checkLogin,userController.getAllusers);
router.delete('/:userId',checkLogin,userController.deleteUser)
router.post('/follow',checkLogin,userController.followUser)

module.exports = router;