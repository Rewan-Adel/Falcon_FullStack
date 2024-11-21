const cloudinary = require('../config/cloudinary');
const {serverErrorMessage} = require('../middlewares/error.messages.middleware');

const uploadImgToCloud = async function(filePath){
    try{
        const image = await cloudinary.uploader.upload(filePath);
        return {
            url       : image.secure_url,
            public_id : image.public_id
        }
    }catch(error){
        console.error("Error in cloudHandler file: ",error);
    }
};

const deleteImgFromCloud = async function(publicId){
    try{
        let publicID = publicId.replace(/"/g, '');
        await cloudinary.uploader.destroy(publicID);
        
        return {};
    }catch(error){
        console.error("Error in cloudHandler file: ",error);
    }
};

module.exports = {
    uploadImgToCloud,
    deleteImgFromCloud
} 