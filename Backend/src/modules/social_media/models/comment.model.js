const {DataTypes, Model} = require("sequelize");

class Comment extends Model {
    static init(sequelize, DataTypes){
        return super.init({
            commentID: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            parentCommentID: {
                type: DataTypes.INTEGER,
                allowNull: true, 
                references: {
                    model: 'Comment',
                    key: 'commentID'
                }
            },
            postID:{
                type: DataTypes.INTEGER,
                references:{
                    model: 'Post',
                    key: 'postID'
                }
            },
            userID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'User',
                    key: 'userID'
                }
            },
            eventID:{
                type: DataTypes.INTEGER,
                references:{
                    model: 'Event',
                    key: 'eventID'
                }
            },
            content:{
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            
        },{
            sequelize,
            tableName: "Comment",
            timestamps: false
        })
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'userID', as: 'user' });
        this.belongsTo(models.Post, { foreignKey: 'postID', as: 'post' });
        //this.belongsTo(models.Event, { foreignKey: 'eventID', as: 'event' });
        
        this.belongsTo(models.Comment, { foreignKey: 'parentCommentID', as: 'parentComment' });  // Self-referential association
        this.hasMany(models.Comment, { foreignKey: 'parentCommentID', as: 'replies' });          // Replies association
        this.hasMany(models.Likes, { foreignKey: 'likeID', as: 'likes' });          // Replies association
    }
};

module.exports = Comment;