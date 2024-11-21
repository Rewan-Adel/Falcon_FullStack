const {DataTypes, Model} = require('sequelize');

class Follow extends Model{
    static init(sequelize){
        return super.init({
            followID : {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            followerID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: "User",
                    key: "userID" 
                }
            },
            followedID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: "User",
                    key: "userID" 
                }
            },

            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
        }, {
            sequelize,
            tableName: 'Follow',
            timestamps: false
        });
    }

    static associate(models){
        this.belongsTo( models.User, {
            foreignKey: 'followerID',
            as: 'follower'
        })
        this.belongsTo( models.User, {
            foreignKey: 'followedID',
            as: 'followed'
        })
    }
};

module.exports = Follow;