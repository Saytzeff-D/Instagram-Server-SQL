const express = require('express')
const router = express.Router()
const DataBaseController = require('../controllers/database.controller')

router.post('/register', DataBaseController.register)
router.post('/login', DataBaseController.login)
router.post('/userData', DataBaseController.userData)
router.post('/profilePhoto', DataBaseController.profilePhoto)
router.post('/editProfile', DataBaseController.editProfile)
router.post('/fetchProfile', DataBaseController.fetchProfile)
router.post('/createPost', DataBaseController.createPost)
router.get('/fetchAllPost', DataBaseController.fetchAllPost)
router.get('/listOfUsers', DataBaseController.listOfAllUsers)

module.exports = router