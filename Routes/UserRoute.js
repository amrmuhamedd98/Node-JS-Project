const express = require("express");
const route = express.Router();
const userController = require("../Controllers/UserController");
const asyncWrapper = require("../utils/HandelErr");
const isAuthorize = require("../Middlewares/Authorization");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "Uploads/");
  },
  filename: function (req, file, callback) {
    const fileName = uuidv4() + "-" + file.originalname;
    callback(null, fileName);
  },
});
const upload = multer({ storage });

// Register
route.post(
  "/register",
  upload.single("ImgUrl"),
  asyncWrapper(userController.Register)
);
// Login
route.post("/login", asyncWrapper(userController.Login));
// Get All Users
route.get(
  "/get-all",
  isAuthorize("Admin"),
  asyncWrapper(userController.GetAllUsers)
);
// Get User By ID
route.get(
  "/get-user/:userId",
  isAuthorize("Admin"),
  asyncWrapper(userController.GetUserById)
);
// Edit User
route.put(
  "/edit/:userId",
  isAuthorize(["Admin"]),
  asyncWrapper(userController.EditUser)
);
// Delete User (soft delete)
route.delete(
  "/delete/:userId",
  isAuthorize(["Admin"]),
  asyncWrapper(userController.DeleteUser)
);
// Assign Role to User
route.post(
  "/add-role/:userId",
  isAuthorize(["Admin"]),
  asyncWrapper(userController.AssignRole)
);
// Search Users
route.get(
  "/search",
  isAuthorize(["Admin"]),
  asyncWrapper(userController.SearchUsers)
);
// Change User Photo
route.put(
  "/change-photo/:userId",
  upload.single("ImgUrl"),
  asyncWrapper(userController.ChangePhoto)
);
// Change User Password
route.put(
  "/change-password/:userId",
  isAuthorize(["User", "Admin"]),
  asyncWrapper(userController.ChangePassword)
);

module.exports = route;
