const { Category } = require("../models");

class CategoryController {
  static async read(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json({
        message: "Success Read Categories",
        categories,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async add(req, res, next) {
    try {
      const { name } = req.body;
      const category = await Category.create({ name });

      res.status(201).json({
        message: "Success Create Category",
        category,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;

      let category = await Category.findByPk(id);
      if (!category) {
        throw { name: "NotFound", id };
      }

      const { name } = req.body;
      await Category.update(
        {
          name,
        },
        {
          where: {
            id,
          },
        }
      );

      category = await Category.findByPk(id);

      res.status(200).json({
        message: `Success Update Category with ID ${id}`,
        category,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = CategoryController;
