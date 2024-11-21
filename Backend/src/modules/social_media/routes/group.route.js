const router = require('express').Router();
const {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroups,
    getGroup
} = require('../controllers/group.controller');
const {protect, checkVerification} = require('../../../middlewares/auth.token'); 

router.use(protect);
router.use(checkVerification);

router.post('/create', createGroup);
router.get('/all', getAllGroups);
router.get('/get/:groupID', getGroup);
router.put('/update/:groupID', updateGroup);
router.delete('/delete/:groupID', deleteGroup);
module.exports = router;