const wishlist = require("../Models/Wishlist");

// Add To Wishlist
async function AddToWishlist(req, res) {
  let { bookId, userId, priority } = req.body;
  const isExist = await wishlist.findOne({
    BookId: bookId,
    UserId: userId,
    IsDeleted: false,
  });
  if (!isExist) {
    await wishlist.create({
      BookId: bookId,
      UserId: userId,
      Priority: priority,
    });
    return res.status(200).json({
      Message: "Book added to wishlist successfully",
    });
  } else {
    return res.status(409).json({
      Message: "Book already in wishlist",
    });
  }
}

// Remove From Wishlist || Hard Delete Not Soft
async function RemoveFromWishlist(req, res) {
  let { bookId, userId } = req.params;
  const isExist = await wishlist.findOne({
    BookId: bookId,
    UserId: userId,
    IsDeleted: false,
  });
  if (isExist) {
    await wishlist.deleteOne({ BookId: bookId, UserId: userId });
    return res.status(200).json({
      Message: "Book removed from wishlist successfully",
    });
  } else {
    return res.status(200).json({
      Message: "Book is not found in wishlist",
    });
  }
}

// Clear wishlist
async function ClearWishlist(req, res) {
  let { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      Message: "userId is required",
    });
  } else {
    const userWishlist = await wishlist.find({ UserId: userId });
    if (userWishlist && userWishlist.length > 0) {
      await wishlist.deleteMany({ UserId: userId });
      return res.status(200).json({
        Message: "Wishlist cleared successfully",
      });
    } else {
      return res.status(404).json({
        Message: "No wishlist items found for this user",
      });
    }
  }
}

// Get Wishlist By User
async function GetWishlistByUser(req, res) {
  let { userId } = req.params;
  const userWishlist = await wishlist.find({ UserId: userId });
  if (userWishlist && userWishlist.length > 0) {
    return res.status(200).json({
      Message: "Wishlist retrieved successfully",
      Data: wishlist,
    });
  } else {
    return res.status(404).json({
      Message: "Wishlist is empty or not found",
    });
  }
}

module.exports = {
  AddToWishlist,
  RemoveFromWishlist,
  ClearWishlist,
  GetWishlistByUser,
};
