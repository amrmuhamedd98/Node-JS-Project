const express = require("express");
const route = express.Router();
const bookController = require("../Controllers/BookController");
const asyncWrapper = require("../utils/HandelErr");
const isAuthorize = require("../Middlewares/Authorization");

// Add Book
route.post(
  "/add",
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.AddBook)
);
// Edit Book
route.put(
  "/edit/:bookId",
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.EditBook)
);
// Delete Book (soft delete)
route.delete(
  "/delete/:bookId",
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.DeleteBook)
);
// Get All Books
route.get(
  "/get-all",
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.GetAllBooks)
);
// Get Book By Id
route.get(
  "/get-book/:bookId",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(bookController.GetBookById)
);
// Search Books
route.get(
  "/search",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(bookController.SearchBooks)
);
// Filter Books By Category
route.get(
  "/filter/:category",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(bookController.FilterBooksByCategory)
);

module.exports = route;
