const {models} = require('../../../config/Database');
const {Comment, Post, User} = models;
const {
    serverErrorMessage,
    badRequestMessage
} = require('../../../middlewares/error.messages.middleware');
const Group_ = require('../models/group.model');

//Post Comments Handling
const createPostComment = async (req, res) => {
    const {userID} = req.user;
    const {postID} = req.params;
    try{
        const post = await Post.findByPk(postID);
        if(!post) return badRequestMessage("Post not found!", res);

        if(req.body.parentCommentID ){
            const parentComment = await Comment.findByPk(req.body.parentCommentID);
            if(!parentComment) return badRequestMessage("Parent comment not found!", res);
        }
        let value = {...req.body, postID, userID};

        let comment = await Comment.create(value)
        if(!comment) return serverErrorMessage({message:"Can't create comment"}, res);
  
        comment = await Comment.findByPk(comment.commentID, {
            include:[{model: User, as: 'user'},
                {model: Post, as: 'post',
                    include:[
                        {model: User, as: 'user'},
                        {model:Group_, as: 'group',
                            include:[
                                {model: User, as: 'creator'}
                            ]
                        }
                    ]}
                ]
        });
        return res.status(201).json({
            status: 'success',
            message: `Comment is added successfully.`,
            data:{comment}
        })
    }catch(error){
        console.log("Error in createPostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const updatePostComment = async (req, res) => {
    const {userID} = req.user;
    const {commentID} = req.params;
    try{
        const comment = await Post.findByPk(commentID);
        if(!comment) return badRequestMessage("Comment not found!", res);
        
        if(comment.userID !== userID) return badRequestMessage("You are not allowed to update this comment.", res);
        if(!req.body) return badRequestMessage("Please, enter your update");

        await Comment.update(req.body, {
            where:{ commentID}
        })
        const updatedComment = await Comment.findByPk(commentID,{
            include:[{model: User, as: 'user'}, {model: Post, as: 'post'}]
        });
        return res.status(200).json({
            status: 'success',
            message: `Comment is updated successfully.`,
            data:{comment: updatedComment}
        })
    }catch(error){
        console.log("Error in updatePostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const getPostComment  = async (req, res) => {
    const {userID} = req.user;
    const {commentID} = req.params;
    try{
        const comment = await Comment.findByPk(commentID,
            {
                include:[
                    {
                        model: Comment, as: 'replies',
                        include:{model: User, as: 'user'}
                    },
                    {model: User, as: 'user'},
                    {model: Post, as: 'post'}
            ]
        }
        );
        if(!comment) return badRequestMessage("Comment not found!", res);
        

        return res.status(200).json({
            status: 'success',
            message: ``,
            data:{comment}
        })
    }catch(error){
        console.log("Error in getPostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const getAllPostComments  = async (req, res) => {
    const {page} = req.query || 1;
    const limit = 10;
    const offset = page ? (page - 1) * limit : 0;
    const {postID} = req.params;
    try{
        const post = await Post.findByPk(postID);
        if(!post) return badRequestMessage("Post not found!", res);

        const {count, rows} = await Comment.findAndCountAll({
            limit,
            offset,
            where:{
                postID
            },
            include:[
                {
                    model: Comment, as: 'replies',
                    include:{model: User, as: 'user'}
                },
                {model: User, as: 'user'},
                {model: Post, as: 'post'}
            ]
        });        

        return res.status(200).json({
            status: 'success',
            message: ``,
            data:{
                comments: rows,
                total: count,
                pages: Math.ceil(count/limit),
                current_page: page,
        }
    })
    }catch(error){
        console.log("Error in getAllPostComments function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

const deletePostCommentAndReplies   = async (req, res) => {
    const {userID} = req.user;
    const {commentID} = req.params;
    try{
        const comment = await Comment.findByPk(commentID);
        if(!comment) return badRequestMessage("Comment not found!", res);
        
        if(comment.userID !== userID) return badRequestMessage("You are not allowed to delete this comment.", res);

        await Comment.destroy({
            where:{ commentID}
        })
        await Comment.destroy({
            where: { parentCommentID: commentID },
        });
        return res.status(200).json({
            status: 'success',
            message: `Comments is deleted successfully.`,
            data: null
        })
    }catch(error){
        console.log("Error in deletePostComment function: ", error.message);
        return serverErrorMessage(error, res);

    }
};

module.exports = {
    createPostComment,
    updatePostComment,
    getPostComment,
    getAllPostComments,
    deletePostCommentAndReplies
};