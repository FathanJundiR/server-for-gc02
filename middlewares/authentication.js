const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw { name: "Unauthorized" };

    const access_token = authorization.split(" ")[1];

    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.id);

    if (!user) throw { name: "Unauthorized" };

    req.logInfo = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = authentication;
