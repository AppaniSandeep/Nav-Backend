const { signup, login, home, deleteUser } = require("../Controllers/AuthController");
const { loginValidation, signupValidation } = require("../Middlewares/AuthValidation");
const {verifyToken} = require("../Middlewares/TokenVerification");

const router = require("express").Router();

router.post("/login",loginValidation,login)

router.post("/signup",signupValidation, signup);

router.get("/home",verifyToken, home);

router.delete("/delete/:id", deleteUser);

module.exports = router
