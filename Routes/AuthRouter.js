const { signup, login, home } = require("../Controllers/AuthController");
const { loginValidation, signupValidation } = require("../Middlewares/AuthValidation");

const router = require("express").Router();

router.post("/login",loginValidation,login)

router.post("/signup",signupValidation, signup);

router.get("/home", home);

module.exports = router
