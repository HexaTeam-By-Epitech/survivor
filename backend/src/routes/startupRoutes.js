const express = require("express");
const { signupController } = require("@controllers/authController");
const { loginController } = require("@controllers/authController");
const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
