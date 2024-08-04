const { Article, User } = require("../models");
const { Op } = require("sequelize");
const imagekit = require("../utils/imageKit");

class ArticleController {
  static async read(req, res, next) {
    try {
      const { filter, sort, page, search } = req.query;
      const paramsQuerySql = {
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
        where: {},
      };

      if (filter) {
        paramsQuerySql.where.categoryId = filter;
      }

      if (search) {
        paramsQuerySql.where.title = { [Op.iLike]: `%${search}%` };
      }

      if (sort) {
        const ordering = sort[0] === "-" ? "DESC" : "ASC";
        const columnName = ordering === "DESC" ? sort.slice(1) : sort;

        paramsQuerySql.order = [[columnName, ordering]];
      }

      let limit = 10;
      let pageNumber = 1;
      if (page) {
        if (page.size) {
          limit = Number(page.size);
          paramsQuerySql.limit = limit;
        }
        if (page.number) {
          pageNumber = Number(page.number);
          paramsQuerySql.offset = limit * (pageNumber - 1);
        }
      }

      const { count, rows } = await Article.findAndCountAll(paramsQuerySql);

      res.status(200).json({
        message: "Successs Read Article",
        totalData: count,
        dataPerPage: limit,
        totalPage: Math.ceil(count / limit),
        page: pageNumber,
        data: rows,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async readById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id);
      if (!article) {
        throw { name: "NotFound", id };
      }

      res
        .status(200)
        .json({ message: `Successs Read Article With Id ${id}`, article });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async add(req, res, next) {
    try {
      const { userId } = req.logInfo;
      if (!userId) throw { name: "Unauthorized" };

      const { title, content, imgUrl, categoryId } = req.body;

      const articles = await Article.create({
        title,
        content,
        imgUrl,
        categoryId,
        authorId: userId,
      });
      res.status(201).json({
        message: "Success Create New Article",
        articles,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      let article = await Article.findByPk(id);

      if (!article) {
        throw { name: "NotFound", id };
      }

      const { title, content, imgUrl, categoryId, authorId } = req.body;
      await Article.update(
        {
          title,
          content,
          imgUrl,
          categoryId,
          authorId,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: `Success Update Article with ID ${id}`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id);

      if (!article) {
        throw { name: "NotFound", id };
      }

      await Article.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: `Success Delete Article with id ${id}`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async patchImgUrl(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id);

      if (!article) {
        throw { name: "NotFound", id };
      }

      //req.file ditambahkan oleh multer

      const file = req.file.buffer.toString("base64");
      const fileName = req.file.originalname;
      const { url } = await imagekit.upload({
        file,
        fileName,
      });

      await Article.update(
        { imgUrl: url },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: `Success Update Products with id ${id}`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ArticleController;
