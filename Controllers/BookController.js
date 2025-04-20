const book = require("../Models/Book");
const { json } = require("express");

// Add Book
async function AddBook(req, res) {
  let {
    Title,
    Author,
    Publisher,
    Category,
    TotalPages,
    Description,
    Rate,
    ImageURL,
    Status,
    UserId,
  } = req.body;
  let bookAdded = await book.create({
    Title,
    Author,
    Publisher,
    Category,
    TotalPages,
    Description,
    Rate,
    ImageURL,
    Status,
    UserId,
  });
  if (bookAdded) {
    return res.status(200).json({
      Message: "Book added successfully",
    });
  } else {
    return res.status(500).json({
      Message: "Failed to add book",
    });
  }
}

// Edit Book
async function EditBook(req, res) {
  let { bookId } = req.params;
  const existBook = await book.findById(bookId);
  if (!existBook) {
    return res.status(404).json({
      Message: "Book not found",
    });
  }
  let updatedBook = await book.updateOne({ _id: bookId }, { $set: req.body });
  if (updatedBook.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Updated book successfully",
    });
  } else {
    return res.status(404).json({
      Message: "No changes were made to the book",
    });
  }
}

// Delete Book (soft delete)
async function DeleteBook(req, res) {
  let { bookId } = req.params;
  const existBook = await book.findById(bookId);
  if (!existBook || existBook.IsDeleted) {
    return res.status(404).json({
      Message: "Book not found or already deleted",
    });
  }
  let deletedBook = await book.updateOne(
    { _id: bookId },
    { $set: { IsDeleted: true } }
  );
  if (deletedBook.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Book marked as deleted successfully",
    });
  } else {
    return res.status(404).json({
      Message: "No changes were made to the book",
    });
  }
}

// Get All Books
async function GetAllBooks(req, res) {
  let books = await book.find({ IsDeleted: { $ne: true } });
  if (books.length > 0) {
    return res.status(200).json({
      Message: "Books fetched successfully",
      Data: books,
    });
  } else {
    return res.status(404).json({
      Message: "No books found",
    });
  }
}

// Get Book By Id
async function GetBookById(req, res) {
  let { bookId } = req.params;
  const foundBook = await book.findOne({
    _id: bookId,
    IsDeleted: { $ne: true },
  });
  if (foundBook) {
    return res.status(200).json({
      Message: "Book fetched successfully",
      Data: foundBook,
    });
  } else {
    return res.status(404).json({
      Message: "Book not found",
    });
  }
}

// Search Books
async function SearchBooks(req, res) {
  const { keyword } = req.query;
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({
      Message: "Search keyword is required",
    });
  }
  const books = await book.find({
    IsDeleted: { $ne: true },
    $or: [
      { Title: { $regex: keyword, $options: "i" } },
      { Author: { $regex: keyword, $options: "i" } },
    ],
  });
  return res.status(200).json({
    Message: "Search completed",
    Data: books,
  });
}

// Filter Books By Category
async function FilterBooksByCategory(req, res) {
  const { category } = req.params;
  const booksInCategory = await book.find({
    Category: category,
    IsDeleted: { $ne: true },
  });
  return res.status(200).json({
    Message: `Books in Category: ${category}`,
    Data: booksInCategory,
  });
}

module.exports = {
  AddBook,
  EditBook,
  DeleteBook,
  GetAllBooks,
  GetBookById,
  SearchBooks,
  FilterBooksByCategory,
};
