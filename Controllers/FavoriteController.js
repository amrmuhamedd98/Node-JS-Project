const Favorite = require('../Models/Favorite');
const Book = require('../Models/Book');

async function addFavorite  (req, res, next) {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        error: `Book not found with id of ${bookId}`
      });
    }

    let favorite = await Favorite.findOne({
      book: bookId,
      user: req.user.id
    });

    if (favorite) {
      favorite.count += 1;
      await favorite.save();
    } else {
      favorite = await Favorite.create({
        book: bookId,
        user: req.user.id,
        count: 1
      });
    }

    res.status(201).json({ success: true, data: favorite });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

async function getFavorites (req, res) {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'book',
        select: 'title author imageURL'
      });

    res.status(200).json({ 
      success: true, 
      count: favorites.length, 
      data: favorites 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

async function removeFavorite  (req, res) {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({ 
        success: false,
        error: `Favorite not found with id of ${req.params.id}`
      });
    }

    if (favorite.user.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized to remove this favorite'
      });
    }

    await favorite.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
    };
