const express = require("express");
const route = express.Router();
const userController = require("../Controllers/UserController");
const asyncWrapper = require("../utils/HandelErr");

// Register
route.post("/register", asyncWrapper(userController.Register));
// Login
route.post("/login", asyncWrapper(userController.Login));
// Get All Users
route.get("/get-all", asyncWrapper(userController.GetAllUsers));
// Get User By ID
route.get("/get-user/:userId", asyncWrapper(userController.GetUserById));
// Edit User
route.put("/edit/:userId", asyncWrapper(userController.EditUser));
// Delete User (soft delete)
route.delete("/delete/:userId", asyncWrapper(userController.DeleteUser));
// Assign Role to User
route.post("/add-role/:userId", asyncWrapper(userController.AssignRole));
// Search Users
route.get("/search", asyncWrapper(userController.SearchUsers));
// Change User Password
route.put("/change-password", asyncWrapper(userController.ChangePassword));

module.exports = route;
