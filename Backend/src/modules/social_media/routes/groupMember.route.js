const router = require('express').Router();
const {
    addMember,
    removeMember,
    getMembers,
    updateMemberRole,
    leaveGroup
} = require('../controllers/groupMember.controller');
const {protect, checkVerification} =  require('../../../middlewares/auth.token'); 

router.use(protect);
router.use(checkVerification);

router.post('/add/:memberID/:groupID', addMember);
router.get('/:groupID', getMembers);
router.put('/update/:memberID/:groupID', updateMemberRole);
router.delete('/remove/:memberID/:groupID', removeMember);
router.delete('/leave/:groupID', leaveGroup);

module.exports = router;
