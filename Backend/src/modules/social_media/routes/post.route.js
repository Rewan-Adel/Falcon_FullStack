const router = require('express').Router();
const {
    createPost,
    getAllPosts,
    getOnePost,
    updatePost,
    deletePost,
    getUserPosts
} = require('../controllers/post.controller');
const { uploadMultiple } = require('../../../utils/multer');
const { protect, checkVerification } = require('../../../middlewares/auth.token'); 

router.use(protect);
router.use(checkVerification);

router.post('/add', uploadMultiple, createPost);
router.patch('/update/:id',uploadMultiple,updatePost);

router.get('/get-all',getAllPosts);
router.get('/get/:id',getOnePost);
router.get('/get-all/UserPosts',getUserPosts);

router.delete('/delete/:id', deletePost)

module.exports = router;