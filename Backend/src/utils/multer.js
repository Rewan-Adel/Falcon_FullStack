const multer = require('multer');
const {badRequestMessage} = require('../middlewares/error.messages.middleware');

const storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const filter = function(req, file, cb){
    if( ! file.originalname.match())
        cb(badRequestMessage(null,'Image must be jpg or jpeg or png'), false);
    cb(null, true)
};

const uploadSingle = multer({
    storage: storage,
    fileFilter: filter
}).single('img');

const uploadMultiple = multer({
    storage: storage,
    fileFilter: filter
}).array('images');

module.exports = {
    uploadSingle,
    uploadMultiple
}