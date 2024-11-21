const router = require('express').Router();
const {
    uploadCardImage,
    uploadSelfieImage,
    approveIdentity,
    refuseIdentity,
    reviewIdentity
} = require('../controllers/identity.controller.js');

const {uploadSingle} = require("../../../utils/multer.js");
const {protect,restrictTo, checkVerification} =  require('../../../middlewares/auth.token');  

// User routes
router.use(protect);
router.use(checkVerification);
router.post('/upload-card-image',  uploadSingle, uploadCardImage);
router.post('/upload-selfie-image',uploadSingle, uploadSelfieImage);

// Admin routes
router.use(restrictTo('admin'));
router.patch('/approve/:userID', approveIdentity);
router.patch('/review/:userID', reviewIdentity);
router.patch('/refuse/:userID', refuseIdentity);

module.exports = router;