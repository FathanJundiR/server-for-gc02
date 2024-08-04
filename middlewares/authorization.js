const { User, Article } = require("../models");

async function articleAuthorization(req, res, next) {
  try {
    const { userId, role } = req.logInfo;

    if (role === "Staff") {
      const user = await User.findByPk(userId);

      if (!user) {
        throw { name: "Forbidden" };
      }

      const { id } = req.params;
      const article = await Article.findByPk(id);

      if (!article) {
        throw { name: "NotFound", id };
      }

      if (article.authorId !== user.id) {
        throw { name: "Forbidden" };
      }
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

function adminAuthorization(req, res, next) {
  const { role } = req.logInfo;
  if (role === "Admin") {
    next();
  } else {
    throw { name: "Forbidden" };
  }
}

module.exports = { articleAuthorization, adminAuthorization };
