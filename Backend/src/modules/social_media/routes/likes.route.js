const router = require('express').Router();
const  {
    likePost,
    unlikePost,
    getPostLikes,
    likeComment,
    unlikeComment,
    getCommentLikes
} = require('../controllers/likes.controller');
const {protect, checkVerification} =  require('../../../middlewares/auth.token');  

router.use(protect);
router.use(checkVerification);

//Post like
router.get('/post/:postID', likePost);
router.get('/post/unlike/:postID', unlikePost);
router.get('/post/get/all/:postID', getPostLikes);

//comment like
router.get('/comment/:commentID', likeComment);
router.get('/comment/unlike/:commentID', unlikeComment);
router.get('/comment/get/all/:commentID', getCommentLikes);



module.exports = router;