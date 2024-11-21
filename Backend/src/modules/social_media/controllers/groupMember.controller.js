const {models} = require('../../../config/Database');
const {GroupMember, Group, User} = models;
const {
    serverErrorMessage,
    badRequestMessage,
    unAuthorizedMessage
} = require('../../../middlewares/error.messages.middleware');


const addMember = async(req, res)=>{
    const {userID}   = req.user;
    const {memberID} = req.params;
    const {groupID}  = req.params;

    try{
        const group = await Group.findByPk(groupID);
        if(!group) return badRequestMessage('Group not found!', res);

        if(group.creatorID !== userID)
            return unAuthorizedMessage('You are not allowed to add members to this group.', res);


        const existingMember = await GroupMember.findOne({ 
            where: { groupID, userID: memberID } 
        });
        if (existingMember || memberID === group.creatorID) {
            return badRequestMessage('Member is already in this group.', res);
        }

        await GroupMember.create({groupID, userID: memberID});
        const memberDetails = await GroupMember.findOne({
            where: { groupID, userID: memberID },
            include: [
                { model: User, as: 'member' },
                { 
                    model: Group,
                    as: 'group',
                    include: [
                        { model: User, as: 'creator' }
                    ]
                }
            ]
        });

        return res.status(201).json({
            status: 'success',
            message: `Member added to the group successfully.`,
            data: {
                member: memberDetails
            }
        });
    }catch(error){
        console.log('Error at add member: ', error);
        return serverErrorMessage(error, res);
    }
};

const removeMember = async(req, res)=>{
    const {userID}   = req.user;
    const {memberID} = req.params;
    const {groupID}  = req.params;

    try{
        const group = await Group.findByPk(groupID);
        if(!group) return badRequestMessage('Group not found!', res);

        if(group.creatorID !== userID)
            return unAuthorizedMessage('You are not allowed to remove members from this group.', res);

        const member = await GroupMember.findOne({ 
            where: { groupID, userID: memberID } 
        });
        if (!member) {
            return badRequestMessage('Member is not in this group.', res);
        }

        await member.destroy();
        return res.status(200).json({
            status: 'success',
            message: `Member removed from the group successfully.`,
            data: null
        });
    }catch(error){
        console.log('Error at remove member: ', error);
        return serverErrorMessage(error, res);
    }
};

const getMembers = async(req, res)=>{
    const {userID} = req.user;
    const {groupID} = req.params;

    try{
        const group = await Group.findByPk(groupID);
        if(!group) return badRequestMessage('Group not found!', res);

        
        const {count, rows} = await GroupMember.findAndCountAll({
            where: { groupID },
            include: [
                { model: User, as: 'member' },
                { 
                    model: Group,
                    as: 'group',
                    include: [
                        { model: User, as: 'creator' }
                    ]
                }
            ]
        });

        return res.status(200).json({
            status: 'success',
            message: 'Group members fetched.',
            data:{
                members: rows,
                total: count,
                pages: Math.ceil(count/limit),
                current_page: page,            }
        });
    }catch(error){
        console.log('Error at get members: ', error);
        return serverErrorMessage(error, res);
    }
};

const updateMemberRole = async(req, res)=>{
    const {userID} = req.user;
    const {memberID} = req.params;
    const {groupID} = req.params;

    try{
        const group = await Group.findByPk(groupID);
        if(!group) return badRequestMessage('Group not found!', res);

        if(group.creatorID !== userID)
            return unAuthorizedMessage('You are not allowed to update members in this group.', res);

        const member = await GroupMember.findOne({ 
            where: { groupID, userID: memberID } 
        });
        if (!member) {
            return badRequestMessage('Member is not in this group.', res);
        }

        await member.update({
            isAdmin: !member.isAdmin
        });

        const memberDetails = await GroupMember.findOne({
            where: { groupID, userID: memberID },
            include: [
                { model: User, as: 'member' },
                { 
                    model: Group,
                    as: 'group',
                    include: [
                        { model: User, as: 'creator' }
                    ]
                }
            ]
        });

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: `Member updated successfully.`,
            data: memberDetails
        });
    }catch(error){
        console.log('Error at update member: ', error);
        return serverErrorMessage(error, res);
    }
};

const leaveGroup = async(req, res)=>{
    const {userID} = req.user;
    const {groupID} = req.params;

    try{
        const group = await Group.findByPk(groupID);
        if(!group) return badRequestMessage('Group not found!', res);

        const member = await GroupMember.findOne({ 
            where: { groupID, userID } 
        });
        // if (userID === group.creatorID) {
        //     return badRequestMessage('The group creator cannot leave the group without transferring ownership.', res);
        // }

        if (!member) {
            return badRequestMessage('You are not in this group.', res);
        }

        await member.destroy();
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: `You left the group successfully.`,
        });
    }catch(error){
        console.log('Error at leave group: ', error);
        return serverErrorMessage(error, res);
    }
};

module.exports = {
    addMember,
    removeMember,
    getMembers,
    updateMemberRole,
    leaveGroup
};
