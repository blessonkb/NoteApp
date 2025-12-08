const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authController = require("../controller/authController");
const appController = require("../controller/appController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);
router.get("/user", auth, authController.getUserDetails);
router.get("/", auth, appController.getcategories);
router.get("/notes", auth, appController.getNotes);
router.delete("/deleteCategory/:id", auth, appController.deleteCategory);
router.delete("/deleteNote/:id", auth, appController.deleteNote);
router.post("/addCategory", auth, appController.addCategory);
router.post("/addNote", auth, appController.addNote);
router.put("/updateCategory/:id", auth, appController.updateCategory);
router.put("/updateNote/:id", auth, appController.updateNote);
module.exports = router;
