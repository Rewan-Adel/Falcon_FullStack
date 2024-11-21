const {models} = require('../../../config/Database');
const {Group, User}  = models;
const {
    serverErrorMessage,
    badRequestMessage,
    unAuthorizedMessage
} = require('../../../middlewares/error.messages.middleware');

const createGroup = async(req, res)=>{
    const {userID} = req.user;
    const {name, description, privacy, isHidden} = req.body;

    if(!name) return badRequestMessage('Group name is required.', res);

    try{
        const group = await Group.create({creatorID: userID, name, description, privacy, isHidden},{
            include: [
                {model: User, as: 'creator'}
            ]
        });
        return res.status(201).json({
            status: 'success',
            message: 'Group created.',
            data:{group}
        });
    }catch(error){
        console.log('Error at create group: ', error);
        return serverErrorMessage(error, res);
    }
};

const updateGroup =async(req, res)=>{
    const {userID} = req.user;
    const {groupID} = req.params;
    try{
        let group = await Group.findByPk(groupID);
        if(!group)
            return badRequestMessage('Group not found!', res);

        if(userID !== group.creatorID) 
            return unAuthorizedMessage("You are not allowed  to edit this group.",res);

        await Group.update(req.body, {
            where:{ creatorID : userID }
        });

        group = await Group.findByPk(groupID,{
            include: [
                {model: User, as: 'creator'}
            ]
        });
        return res.status(200).json({
            status: 'success',
            message: 'Group updated.',
            data:{group}
        });
        
    }catch(error){
        console.log('Error at create group: ', error);
        return serverErrorMessage(error, res);
    }
};

const deleteGroup = async(req, res)=>{
    const {userID} = req.user;
    const {groupID} = req.params;
    try{
        let group = await Group.findByPk(groupID);
        if(!group)
            return badRequestMessage('Group not found!', res);

        if(userID !== group.creatorID) 
            return unAuthorizedMessage("You are not allowed  to delete this group.",res);

        await Group.destroy({
            where: {groupID}
        });

        return res.status(200).json({
            status: 'success',
            message: 'Group deleted.',
            data: null
        });
        
    }catch(error){
        console.log('Error at create group: ', error);
        return serverErrorMessage(error, res);
    }
};

const getGroup = async(req, res)=>{
    const {groupID} = req.params;
    try{
        let group = await Group.findByPk(groupID,{
            include: [
                {model: User, as: 'creator'}
            ]
        });

        if(!group)
            return badRequestMessage('Group not found!', res);

        return res.status(200).json({
            status: 'success',
            message: 'Group retrieved.',
            data:{group}
        });
        
    }catch(error){
        console.log('Error at create group: ', error);
        return serverErrorMessage(error, res);
    }
};

const getAllGroups = async(req, res)=>{
    const limit = req.query.limit || 10;
    const page  = req.query.page  || 1;
    const skip = (page - 1) * limit;
    try{
        let {count, rows} = await Group.findAndCountAll({
            limit,
            offset: skip,
            order: [['createdAt', 'DESC']],
            include: [
                {model: User, as: 'creator'}
            ]
        });

        return res.status(200).json({
            status: 'success',
            message: '',
            data:{
                groups: rows,
                total: count,
                pages: Math.ceil(count/limit),
                current_page: page,            }
        });
    }catch(error){
        console.log('Error at create group: ', error);
        return serverErrorMessage(error, res);
    }
}

module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroup,
    getAllGroups
};

