"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Article.belongsTo(models.Category, { foreignKey: "categoryId" });
      Article.belongsTo(models.User, { foreignKey: "authorId" });
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title Required",
          },
          notEmpty: {
            msg: "Title Required",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Content Required",
          },
          notEmpty: {
            msg: "Content Required",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "CategoryId Required",
          },
          notEmpty: {
            msg: "CategoryId Required",
          },
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "AuthorId Required",
          },
          notEmpty: {
            msg: "AuthorId Required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
