const {models} = require("../../../config/Database");
const {Falcon, User} = models;
const {
    badRequestMessage,
    serverErrorMessage,
    unAuthorizedMessage
} = require('../../../middlewares/error.messages.middleware');

const {
    FalconValidation,
    updateFalconValidation
} = require('../validators/Falcon.validation');

const { 
    uploadImgToCloud 
} = require('../../../utils/cloudHandler');



const createProduct = async (req, res)=>{
    try{
        const {userID} = req.user;
        let {value, error} = FalconValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        if(!req.files || req.files.length === 0)  return badRequestMessage("Please, upload the product's images.", res);
        
        value = {...value, ownerID: userID,  images: []};
        const product = await Falcon.create(value);
        
        if(!product) return serverErrorMessage({message:"Can't create new falcon."}, res);

    
        let imagesArray = [];
        for(let i=0; i< req.files.length; i++){
            const {url, public_id} = await uploadImgToCloud(req.files[i].path);
            imagesArray.push({
                mediaURL: url,
                mediaPublicId: public_id
            });
        }
        product.images = imagesArray;
        await product.save();
        
        return  res.status(201).json({
            status: 'success',
            message: `${product.name} is added successfully.`,
            data: product
        })
    }
    catch(err){
        console.log("Error at Add Falcon function:  ", err)
        return serverErrorMessage(err, res);
    }
};


const getAllProducts = async(req, res)=>{
    const limit = req.params.limit || 10;
    const page  = req.params.page  || 1;
    // const skip  = (limit * page) - 1;
    const skip = (page - 1) * limit;

    const {count, rows} = await Falcon.findAndCountAll({
        limit: limit,
        offset: skip,
        order: [['createdAt', 'DESC']],
        include:[
            {model: User, as: 'owner'}
        ]
    });

    return res.status(200).json({
        status: 'success',
        message:"",
        data: {
            products: rows,
            total: count,
            page: page,
            total_pages: Math.ceil(count / limit)
        },
    });
}

const updateProduct = async (req, res)=>{
    try{
        const {userID} = req.user;
        const {value, error} = updateFalconValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        let product = await Falcon.findByPk(req.params.id);
        if(!product) return badRequestMessage("Product not founded!", res);
        if(product.ownerID != userID) return unAuthorizedMessage("You are not allowed to update this product.",res);
        
        await Falcon.update(value, {
            where:{ FalconID : req.params.id }
        });
        
        
        if (req.files && req.files.length !== 0) {
            let imagesArray = [];
            for(let i=0; i< req.files.length; i++){
                const {url, public_id} = await uploadImgToCloud(req.files[i].path);
                imagesArray.push({
                mediaURL: url,
                mediaPublicId: public_id
            });
        }
            product.images = imagesArray;
            await product.save();
        }

        product = await Falcon.findByPk(req.params.id,{
            include:[
                {model: User, as: 'owner'}
            ]
        });
        return  res.status(200).json({
            status: 'success',
            message: "Product is updated successfully.",
            data:{
                product
            }
        })
    }
    catch(err){
        console.log("Error at AddFalcon function:  ", err)
        return serverErrorMessage(err, res);
    }
};

const getOneProduct = async (req, res)=>{
    try{
        const product = await Falcon.findByPk(req.params.id,
            {
                include: [
                    {model: User, as: 'owner'}
                ]
            });
        if(!product) return badRequestMessage("Product not founded!", res);

        return res.status(200).json({
            status: 'success',
            message: "",
            data:{
                product
            }
        });

    }
    catch(err){
        console.log("Error at getOneProduct function:  ", err)
        return serverErrorMessage(err, res);
    }
};

const deleteProduct = async(req, res)=>{
    try{
        const {userID} = req.user;
        const product = await Falcon.findByPk(req.params.id);
        if(!product) return badRequestMessage("Product not founded!", res);
        if(product.ownerID != userID) return unAuthorizedMessage("You are not allowed  to delete this product.",res);

        await Falcon.destroy({
            where: { FalconID: req.params.id }
        });

        return res.status(200).json({
            status: 'success',
            message: "Product is deleted successfully.",
            data: null
        });
    }
    catch(err){
        console.log("Error at DeleteProduct function:  ", err)
        return serverErrorMessage(err, res);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    getOneProduct,
    deleteProduct
}
