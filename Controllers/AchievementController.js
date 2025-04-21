const Achievement = require("../Models/Achievement");

async function getAchievements(req, res) {
  try {
    const achievements = await Achievement.find({
      user: req.user.id,
      isDeleted: false,
    }).sort("-dateEarned");

    res.status(200).json({ success: true, data: achievements });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

async function createAchievement(req, res) {
  try {
    const achievement = await Achievement.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json({ success: true, data: achievement });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid achievement data" });
  }
}

async function updateAchievement(req, res) {
  try {
    const achievement = await Achievement.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });
    }

    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    res.status(400).json({ success: false, error: "Update failed" });
  }
}

async function deleteAchievement(req, res) {
  try {
    const achievement = await Achievement.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
