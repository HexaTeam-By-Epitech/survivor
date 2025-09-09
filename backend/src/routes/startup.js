const express = require("express");
const router = express.Router();
const StartupController = require("@controllers/startup");

router.get("/", StartupController.getAll);
router.get("/:id", StartupController.getById);
router.put("/:id", StartupController.update);
router.delete("/:id", StartupController.delete);

module.exports = router;
