const express = require('express');
const router = express.Router();
const SectorController = require('@controllers/sector');

router.get('/', SectorController.getAllSectors);
router.get('/:id', SectorController.getSectorById);
router.post('/', SectorController.createSector);
router.put('/:id', SectorController.updateSector);
router.delete('/:id', SectorController.deleteSector);

module.exports = router;
