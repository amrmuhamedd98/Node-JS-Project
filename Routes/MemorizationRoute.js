const express = require('express');
const router = express.Router();
const MemorizationController = require('../Controllers/MemorizationController');


// Get all memorizations for the user
router.get('/get-all', MemorizationController.getMemorizations);

// Create a new memorization
router.post('/create-memorization', MemorizationController.createMemorization);

// Update an existing memorization
router.put('/update-memorization/:id',  MemorizationController.updateMemorization);

// Soft delete a memorization
router.delete('/delete-memorization/:id', MemorizationController.deleteMemorization);

module.exports = router;