"use strict";
const { hash } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Article, { foreignKey: "authorId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Username Required",
          },
          notEmpty: {
            msg: "Username Required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Email Required",
          },
          notEmpty: {
            msg: "Email Required",
          },
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password Required",
          },
          notEmpty: {
            msg: "Password Required",
          },
          len: {
            args: [5],
            msg: "Password Required",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role Required",
          },
          notEmpty: {
            msg: "Role Required",
          },
        },
        defaultValue: "Staff",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "PhoneNumber Required",
          },
          notEmpty: {
            msg: "PhoneNumber Required",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Address Required",
          },
          notEmpty: {
            msg: "Address Required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((instance, option) => {
    instance.password = hash(instance.password);
  });
  return User;
};
