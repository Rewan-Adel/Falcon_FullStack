const router = require("express").Router();
const {
    getProfile,
    updateProfile,
    updateProfileImage,
    deleteProfileImage,
    changePassword,
    changeEmail,
    verifyCodeToChange
}= require("../controllers/user.controller");

const {protect} = require("../../../middlewares/auth.token");
const {uploadSingle} = require("../../../utils/multer");

router.use(protect);
router.patch("/change/email", changeEmail);
router.post("/verify/code", verifyCodeToChange);

router.get("/get/profile", getProfile);

router.patch("/update/profile", updateProfile);
router.patch("/update/profile/picture",uploadSingle, updateProfileImage);
router.patch("/change/password",changePassword);

router.delete("/delete/profile/picture", deleteProfileImage);

module.exports = router;