const express = require('express');
const router = express.Router();
const NewsController = require('@controllers/news');

router.get('/', NewsController.getAllNews);
router.get('/:id', NewsController.getNewById);
router.post('/', NewsController.createNew);
router.put('/:id', NewsController.updateNew);
router.delete('/:id', NewsController.deleteNew);

module.exports = router;
