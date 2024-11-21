const router = require('express').Router();
const  {
    createPostComment,
    updatePostComment,
    getPostComment,
    getAllPostComments,
    deletePostCommentAndReplies
} = require('../controllers/comment.controller');
const {protect, checkVerification} = require('../../../middlewares/auth.token'); 

router.use(protect);
router.use(checkVerification);

//Post routes
router.post('/post/add/:postID', createPostComment);
router.put('/post/update/:commentID', updatePostComment);
router.get('/post/get/:commentID', getPostComment);
router.get('/post/all/:postID', getAllPostComments);
router.delete('/post/delete/:commentID', deletePostCommentAndReplies);



module.exports = router;