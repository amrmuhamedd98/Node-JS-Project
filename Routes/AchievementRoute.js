const express = require('express');
const router = express.Router();
const AchievementController = require('../Controllers/AchievementController');

// Get all achievements
router.get('/get-all', AchievementController.getAchievements);

// Create a new achievement
router.post('/create-achievement', AchievementController.createAchievement);

// Update an existing achievement
router.put('/update-achievement/:id', AchievementController.updateAchievement);

// Soft delete an achievement
router.delete('/delete-achievement/:id', AchievementController.deleteAchievement);

module.exports = router;