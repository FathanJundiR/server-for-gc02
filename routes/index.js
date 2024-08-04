const express = require("express");
const router = express.Router();
const articleRouter = require("./article");
const categoryRouter = require("./category");
const authentication = require("../middlewares/authentication");
const ArticleController = require("../controllers/articleController");
const AuthController = require("../controllers/authController");
const { adminAuthorization } = require("../middlewares/authorization");
const errorHandler = require("../middlewares/errorHandler");
//>ADD_LATER
const CategoryController = require("../controllers/categoryController");
//ADD_LATER<

router.post("/login", AuthController.login);
router.get("/pub/articles", ArticleController.read);
//>ADD_LATER
router.get("/pub/categories", CategoryController.read);
//ADD_LATER<
router.get("/pub/articles/:id", ArticleController.readById);

router.use(authentication);
router.use("/articles", articleRouter);
router.use("/categories", categoryRouter);

router.post("/add-user", adminAuthorization, AuthController.addUser);

router.use(errorHandler);

module.exports = router;
