const express = require('express');
const router = express.Router();
const { getSavedLocations, addSavedLocation, deleteSavedLocation } = require('../controllers/savedLocationController');

router.get('/', getSavedLocations);
router.post('/', addSavedLocation);
router.delete('/:id', deleteSavedLocation);

module.exports = router;
