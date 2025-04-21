const express = require("express");
const route = express.Router();
const bookController = require("../Controllers/BookController");
const asyncWrapper = require("../utils/HandelErr");
const isAuthorize = require("../Middlewares/Authorization");

// Add Book
route.post("/add", asyncWrapper(bookController.AddBook));
// Edit Book
route.put("/edit/:bookId", asyncWrapper(bookController.EditBook));
// Delete Book (soft delete)
route.delete("/delete/:bookId", asyncWrapper(bookController.DeleteBook));
// Get All Books
route.get("/get-all", asyncWrapper(bookController.GetAllBooks));
// Get Book By Id
route.get("/get-book/:bookId", asyncWrapper(bookController.GetBookById));
// Search Books
route.get("/search", asyncWrapper(bookController.SearchBooks));
// Filter Books By Category
route.get(
  "/filter/:category",
  asyncWrapper(bookController.FilterBooksByCategory)
);

module.exports = route;
