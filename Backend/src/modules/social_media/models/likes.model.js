const { DataTypes, Model} = require('sequelize');

class Likes extends Model {
    static init(sequelize) {
        return super.init({
            likeID:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'User',
                    key: 'userID'
                }
            },
            postID: {
                type: DataTypes.INTEGER,
                references:{
                    model: 'Post',
                    key: 'postID'
                }
            },
            commentID:{
                type: DataTypes.INTEGER,
                references:{
                    model: 'Comment',
                    key: 'commentID'
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: new Date()
            },
        }, {
            sequelize,
            tableName: 'likes',
            timestamps: false
        });
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'userID',
            as: 'user'
        });
        this.belongsTo(models.Post,{
            foreignKey: 'postID',
            as: 'post'
        });
        this.belongsTo(models.Comment,{
            foreignKey: 'commentID',
            as: 'Comment'
        });
    }
};
module.exports = Likes;