const express = require("express");
const {
  registerController,
  loginController,
  updateUserContoller,
  requireSignIn,
  createPostController,
  getAllPostController,
  deletePostController,
  getUserPostController,
} = require("../controllers/userController");

const router = express.Router();

//routes
router.post("/register", registerController);
router.post("/login", loginController);
router.put("/update-user", requireSignIn, updateUserContoller);
router.post("/create-post", requireSignIn, createPostController);
router.get("/all-posts", getAllPostController);
router.get("/user-posts",requireSignIn, getUserPostController);
router.delete("/delete-post/:id", requireSignIn, deletePostController);

module.exports = router;
