const express = require('express');
const router = express.Router();
const EventCategoryController = require('@controllers/eventCategory');

router.get('/', EventCategoryController.getAllEventsCategories);
router.get('/:id', EventCategoryController.getEventCategoryById);
router.post('/', EventCategoryController.createEventCategory);
router.put('/:id', EventCategoryController.updateEventCategory);
router.delete('/:id', EventCategoryController.deleteEventCategory);

module.exports = router;
