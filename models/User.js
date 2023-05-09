const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection.js');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    // Username
    display_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Email
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    /*
    hooks: {
      // Modify the input before creation
      beforeCreate: async (newUserData) => {
        console.log('Create hook is running.');
        // Encrypt the user's password
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // Modify the input before updating
      beforeUpdate: async (updatedUserData) => {
        console.log('Update hook is running.');
        // Force the email address into all lowercase characters
        updatedUserData.email = await updatedUserData.email.toLowerCase();
        return updatedUserData;
      },
    },
    */
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
