const router = require('express').Router();
const {
    createProduct,
    getAllProducts,
    updateProduct,
    getOneProduct,
    deleteProduct
} = require('../controllers/market.controller');
const {uploadMultiple} = require('../../../utils/multer');
const {protect, checkVerification} =  require('../../../middlewares/auth.token'); 

router.use(protect);
router.use(checkVerification);

router.post("/add", uploadMultiple, createProduct);
router.get("/get-all", getAllProducts);
router.get("/get/:id", getOneProduct);
router.patch("/update/:id", uploadMultiple, updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;