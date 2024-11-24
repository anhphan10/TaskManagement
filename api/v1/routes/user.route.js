const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller");
const authMiddlewares = require("../middlewares/auth.middlewares")

router.post("/register", controller.register);
router.post("/login",controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.post("/password/reset", controller.resetPassword)
router.get("/detail", authMiddlewares.requireAuth ,controller.detail)
module.exports = router;