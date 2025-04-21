const express = require("express");
const router = express.Router();
const FavoriteController = require("../Controllers/FavoriteController");

// Get all favorites for the user
router.get("/get-all", FavoriteController.getFavorites);

// Add a new favorite
router.post("/add-favorite", FavoriteController.addFavorite);

// Remove a favorite
router.delete("/remove-favorite/:id", FavoriteController.removeFavorite);

module.exports = router;
