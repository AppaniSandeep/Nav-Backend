const { signup, login, home, deleteUser, forgetPassword, getResetPasswordPage, resetPassword } = require("../Controllers/AuthController");
const { loginValidation, signupValidation } = require("../Middlewares/AuthValidation");
const {verifyToken} = require("../Middlewares/TokenVerification");

const router = require("express").Router();

router.post("/login",loginValidation,login)

router.post("/signup",signupValidation, signup);

router.get("/home", verifyToken, home);

router.delete("/delete/:id", verifyToken, deleteUser);

router.post("/forget-password", forgetPassword);

router.get("/reset-password/:token", getResetPasswordPage);

router.post("/reset-password/:token", resetPassword);

module.exports = router