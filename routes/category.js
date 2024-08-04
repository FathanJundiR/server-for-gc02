const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const { adminAuthorization } = require("../middlewares/authorization");

router.get("/", CategoryController.read);
router.post("/", adminAuthorization, CategoryController.add);
router.put("/:id", adminAuthorization, CategoryController.update);

module.exports = router;
