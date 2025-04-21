const Achievement = require("../Models/Achievement");

async function getAchievements(req, res) {
  try {
    const achievements = await Achievement.find({
      user: req.user.id,
      isDeleted: false,
    }).sort("-createdAt");

    res.status(200).json({ success: true, data: achievements });
  } catch (err) {
    console.error("Error fetching achievements:", err);
    res.status(500).json({ success: false, error: "Failed to fetch achievements" });
  }
}

async function createAchievement(req, res) {
  try {
    const achievementData = {
      achievementName: req.body.achievementName,
      description: req.body.description,
      iconUrl: req.body.iconUrl,
      points: req.body.points,
      level: req.body.level,
      book: req.body.book,
      user: req.user.id,
    };

    const achievement = await Achievement.create(achievementData);
    res.status(201).json({ success: true, data: achievement });
  } catch (err) {
    console.error("Error creating achievement:", err);
    res.status(400).json({ success: false, error: err.message || "Invalid achievement data" });
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
      return res.status(404).json({ success: false, error: "Achievement not found" });
    }

    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    console.error("Error updating achievement:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, error: err.message });
    }
    res.status(500).json({ success: false, error: "Failed to update achievement" });
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
      return res.status(404).json({ success: false, error: "Achievement not found" });
    }

    res.status(200).json({ success: true, data: achievement }); 
  } catch (err) {
    console.error("Error deleting achievement:", err);
    res.status(500).json({ success: false, error: "Failed to delete achievement" });
  }
}

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};