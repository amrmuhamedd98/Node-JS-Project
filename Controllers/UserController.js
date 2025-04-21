const user = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const tokenKey = process.env.tokenKey;

// Register
async function Register(req, res) {
  let { Name, Email, UserName, Password, PhoneNumber } = req.body;
  let findByUserName = await user.findOne({ UserName: UserName });
  let findEmail = await user.findOne({ Email: Email });
  if (!findByUserName && !findEmail) {
    let hashedPassword = await bcrypt.hash(`${Password}`, 5);
    const createdUser = await user.create({
      Name,
      Email,
      UserName,
      Password: hashedPassword,
      PhoneNumber,
    });
    return res.status(200).json({
      Message: "User was registered successfully",
    });
  } else {
    return res.status(409).json({
      Message: "UserName or Email already exists",
    });
  }
}

// Login
async function Login(req, res) {
  let { UserName, Password } = req.body;
  let findByUserName = await user.findOne({ UserName: UserName });
  if (findByUserName) {
    bcrypt.compare(Password, findByUserName.Password, function (error, result) {
      if (error) {
        console.log(error.message);
        return res.status(403).json({
          Message: "Invalid Password or User Name",
        });
      } else if (result == true) {
        let token = jwt.sign({ UserName, Role: findByUserName.Role }, tokenKey);
        return res.status(200).json({
          Message: "Logged in successfully",
          Token: token,
        });
      }
    });
  } else {
    return res.status(403).json({
      Message: "Invalid Password or User Name",
    });
  }
}

// Get All Users
async function GetAllUsers(req, res) {
  let allUsers = await user.aggregate([
    {
      $project: {
        _id: 0,
        Name: 1,
        Email: 1,
        UserName: 1,
        PhoneNumber: 1,
        Role: 1,
      },
    },
  ]);
  if (allUsers.length > 0) {
    return res.status(200).json({
      Message: "Get all users successfully",
      Data: allUsers,
    });
  } else {
    return res.status(404).json({
      Message: "No users found",
    });
  }
}

// Get User By ID
async function GetUserById(req, res) {
  let { userId } = req.params;
  const foundUser = await user.findById(userId);
  if (foundUser && foundUser.IsDeleted == false) {
    return res.status(200).json({
      Message: "User retrieved successfully",
      Data: foundUser,
    });
  } else {
    return res.status(404).json({
      Message: "User not found",
    });
  }
}

// Edit User
async function EditUser(req, res) {
  let { userId } = req.params;
  const existUser = await user.findById(userId);
  if (!existUser) {
    return res.status(404).json({
      Message: "User not found",
    });
  }
  let updatedUser = await user.updateOne({ _id: userId }, { $set: req.body });
  if (updatedUser.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Updated user successfully",
    });
  } else {
    return res.status(404).json({
      Message: "No changes were made to the user",
    });
  }
}

// Delete User
async function DeleteUser(req, res) {
  let { userId } = req.params;
  const existUser = await user.findById(userId);
  if (!existUser || existUser.IsDeleted) {
    return res.status(404).json({
      Message: "User not found or already deleted",
    });
  }
  let deletedUser = await user.updateOne(
    { _id: userId },
    { $set: { IsDeleted: true } }
  );
  if (deletedUser.modifiedCount === 1) {
    return res.status(200).json({
      Message: "User marked as deleted successfully",
    });
  } else {
    return res.status(404).json({
      Message: "No changes were made to the user",
    });
  }
}
// Assign Role to User
async function AssignRole(req, res) {
  const { userId } = req.params;
  const { Role } = req.body;
  const existUser = await user.findById(userId);
  if (!existUser || existUser.IsDeleted) {
    return res.status(404).json({
      Message: "User not found or already deleted",
    });
  }
  if (!Role) {
    return res.status(400).json({
      Message: "Role is required",
    });
  }
  const updated = await user.updateOne({ _id: userId }, { $set: { Role } });
  if (updated.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Assign role successfully",
    });
  } else {
    return res.status(400).json({
      Message: "Failed to assign role",
    });
  }
}

// Search Users
async function SearchUsers(req, res) {
  const { keyword } = req.query;
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({
      Message: "Search keyword is required",
    });
  }
  const users = await user.find({
    IsDeleted: { $ne: true },
    $or: [
      { Name: { $regex: keyword, $options: "i" } },
      { Email: { $regex: keyword, $options: "i" } },
      { UserName: { $regex: keyword, $options: "i" } },
    ],
  });
  return res.status(200).json({
    Message: "Search completed",
    Data: users,
  });
}

// Change User Photo
async function ChangePhoto(req, res) {
  let { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      Message: "userId is required",
    });
  }
  const currentUser = await user.findById(userId);
  if (!currentUser) {
    return res.status(404).json({
      Message: "User not found",
    });
  } else {
    if (!req.file) {
      return res.status(400).json({
        Message: "ImgUrl is required",
      });
    }
    const filePath = req.file.path;
    await user.updateOne({ _id: userId }, { $set: { ImgUrl: filePath } });
    return res.status(200).json({
      Message: "User photo updated successfully",
    });
  }
}

// Change User Password
async function ChangePassword(req, res) {
  let { userId } = req.params;
  const { oldPassword, newPassword } = req.body;
  const currentUser = await user.findById(userId);
  if (!currentUser) {
    return res.status(404).json({
      Message: "User not found",
    });
  }
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      Message: "Old and new passwords are required",
    });
  }
  if (oldPassword === newPassword) {
    return res.status(400).json({
      Message: "New password must be different from the old one",
    });
  }
  const isMatch = await bcrypt.compare(oldPassword, currentUser.Password);
  if (!isMatch) {
    return res.status(403).json({
      Message: "Old password is incorrect",
    });
  } else {
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    await user.updateOne(
      { _id: userId },
      { $set: { Password: hashedPassword } }
    );
    return res.status(200).json({
      Message: "Password changed successfully",
    });
  }
}

module.exports = {
  Register,
  Login,
  GetAllUsers,
  GetUserById,
  EditUser,
  DeleteUser,
  AssignRole,
  SearchUsers,
  ChangePhoto,
  ChangePassword,
};
