const {DataTypes,Model} = require('sequelize');

class GroupMember extends Model{
    static init(sequelize){
        return super.init({
            groupID:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                references:{
                    model: 'Group',
                    key: 'groupID'
                }
            },
            userID:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                references:{
                    model: 'User',
                    key: 'userID'
                }
            },
            isAdmin:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },{
            sequelize,
            tableName: 'GroupMember',
            timestamps: false
        });
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'userID', as: 'member'});
        this.belongsTo(models.Group, {foreignKey: 'groupID', as: 'group'});
    }
};

module.exports = GroupMember;