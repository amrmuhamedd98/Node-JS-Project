const Memorization = require("../Models/Memorization");

async function createMemorization(req, res) {
  try {
    const memorization = await Memorization.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json({ success: true, data: memorization });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, error: "Invalid memorization data" });
  }
}

async function getMemorizations(req, res) {
  try {
    const memorizations = await Memorization.find({
      user: req.user.id,
      isDeleted: false,
    }).populate("book", "title author");

    res.status(200).json({ success: true, data: memorizations });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

async function updateMemorization(req, res) {
  try {
    const memorization = await Memorization.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!memorization) {
      return res
        .status(404)
        .json({ success: false, error: "Memorization not found" });
    }

    res.status(200).json({ success: true, data: memorization });
  } catch (err) {
    res.status(400).json({ success: false, error: "Update failed" });
  }
}

async function deleteMemorization(req, res) {
  try {
    const memorization = await Memorization.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!memorization) {
      return res
        .status(404)
        .json({ success: false, error: "Memorization not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

module.exports = {
  createMemorization,
  getMemorizations,
  updateMemorization,
  deleteMemorization,
};
