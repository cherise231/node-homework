const express = require("express");

const router = express.Router();

//import controller functions

const { register, logon, logoff } = require("../controllers/userController");

//set up the routes
router.post("/register", register);
router.post("/logon", logon);
router.post("/logoff", logoff);

module.exports = router;
