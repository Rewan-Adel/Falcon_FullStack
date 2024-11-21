const router = require('express').Router();
const {protect} = require('../../../middlewares/auth.token');
const {
    emailRegisterAPI,
    verifyCode,
    completeProfile,
    resendCode,
    loginByEmail,
    loginPass,
    getGoogleAuthURL,
    googleRegisterAPI,
    logout, resetPassword,  forgotPassword
} = require('../controllers/auth.controller');

router.post('/register/email', emailRegisterAPI);

router.get('/google', (req, res) => {
    res.redirect(getGoogleAuthURL());
});
router.get('/google/callback', googleRegisterAPI );

router.post('/login/email', loginByEmail);
router.post('/login/enter/password', loginPass);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.use(protect);

router.post('/verify/code', verifyCode);
router.get( '/verify/resend', resendCode);

router.post('/register/complete/profile', completeProfile);

router.get('/logout', logout);

module.exports = router;
