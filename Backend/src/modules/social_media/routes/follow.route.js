const router = require('express').Router();
const  {
    addFollow,
    unFollow,
    getFollowers,
    getFollowing
} = require('../controllers/follow.controller');
const {protect, checkVerification} =  require('../../../middlewares/auth.token'); 
router.use(protect);
router.use(checkVerification);

router.get('/:followedID', addFollow);
router.get('/cancel/:followedID', unFollow);
router.get('/followers/:userID', getFollowers);
router.get('/following/:userID', getFollowing);
module.exports = router;
