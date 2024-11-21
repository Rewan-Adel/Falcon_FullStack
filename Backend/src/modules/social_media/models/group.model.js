const { DataTypes, Model} = require('sequelize');

class Group_ extends Model{
    static init(sequelize, DataTypes){
        return super.init({
            groupID:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            creatorID:{
                type:  DataTypes.INTEGER,
                references:{
                    model: 'User',
                    as : 'user'
                }
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false    

            },
            description:{
                type: DataTypes.STRING,
                allowNull: true
            },
            privacy:{
                type: DataTypes.ENUM('public', 'private'),
                defaultValue: 'public'
            },
            isHidden:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            createdAt:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },{
            sequelize,
            tableName: 'Group_',
            timestamps: false
        });
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'creatorID', as: 'creator'});
        this.hasMany(models.Post, {foreignKey: 'postID', as: 'post'})

        this.hasMany(models.GroupMember, {foreignKey: 'groupID', as: 'member'});
    }
};

module.exports = Group_;