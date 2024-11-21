const {DataTypes,Model} = require('sequelize');

class Identity extends Model{
    static init(sequelize, DataTypes){
        return super.init({
            identityID :{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userID: {
                type: DataTypes.INTEGER,
                references:{
                    model: 'User',
                    key: 'userID'
                }
            },
            cardImageURL:{
                type: DataTypes.STRING,
            }, 
            selfieImageURL:{
                type: DataTypes.STRING,
            } ,
            Verification:{
                type: DataTypes.ENUM('approved', 'refused', 'pending', 'review'),
                defaultValue: 'pending'
            }
        },{
            sequelize,
            tableName : 'Identity',
            timestamps: false
        });
    }

    static associations(models){
        this.belongsTo(models.User,{
            foreignKey: 'userID',
            as: 'user'
        });
    }
}

module.exports = Identity;