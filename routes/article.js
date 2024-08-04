const express = require("express");
const router = express.Router();
const ArticleController = require("../controllers/articleController");
const { articleAuthorization } = require("../middlewares/authorization");
const upload = require("../utils/multer");
const middlewareUpload = upload.single("imgUrl");

router.get("/", ArticleController.read);
router.post("/", ArticleController.add);
router.get("/:id", ArticleController.readById);
router.put("/:id", articleAuthorization, ArticleController.update);
router.delete("/:id", articleAuthorization, ArticleController.delete);
router.patch(
  "/:id",
  [articleAuthorization, upload.single("imgUrl")],
  ArticleController.patchImgUrl
);

module.exports = router;
