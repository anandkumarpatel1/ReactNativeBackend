const { hashPassword, comparePassword } = require("../helpers/authHelpler");
const UserModel = require("../model/UserModel");
const PostModel = require("../model/PostModel");
const jsonwebtoken = require("jsonwebtoken");
const { expressjwt: jwt } = require("express-jwt");

const requireSignIn = jwt({
  secret: process.env.JWT_KEY,
  algorithms: ["HS256"],
});

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be 6 character",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "User is already is exits",
      });
    }

    //hash pass
    const hashedPassword = await hashPassword(password);

    //save user
    const user = await UserModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    res.status(201).json({
      success: true,
      message: "Registratrion is successfull please login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Register Api",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be 6 character",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(500).json({
        success: false,
        message: "User is does not exits",
      });
    }

    const comparingPassword = await comparePassword(
      password,
      existingUser.password
    );

    if (!comparingPassword) {
      return res.status(500).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    //token
    const token = await jsonwebtoken.sign(
      { _id: existingUser._id },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    //password undefined for security purpose
    existingUser.password = undefined;
    res.status(201).json({
      success: true,
      message: "Login Successful",
      token,
      existingUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Login Api",
      error,
    });
  }
};

const updateUserContoller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be 6 character",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    console.log("hleo");

    const updateUser = await UserModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updateUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "Profile Updated Plesae Login",
      updateUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in update api",
      error,
    });
  }
};

const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(500).json({
        success: false,
        message: "Title is Empty",
      });
    }

    const post = await PostModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();

    console.log(req);
    return res.status(201).json({
      success: true,
      message: "Post Created Successfull",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in create post api",
      error,
    });
  }
};

const getAllPostController = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All posts data",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in fetch all post api",
      error,
    });
  }
};

const getUserPostController = async (req, res) => {
  try {
    const userPosts = await PostModel.find({postedBy: req.auth._id})
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "user posts data",
      userPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in fetch user post api",
      error,
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await PostModel.findByIdAndDelete({_id: id});

    res.status(200).json({
      success: true,
      message: "Your post has been deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in delete post api",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserContoller,
  requireSignIn,
  createPostController,
  getAllPostController,
  deletePostController,
  getUserPostController
};
