const express = require('express');
const router = express.Router();
const LegalStatusController = require('@controllers/legalStatus');

router.get('/', LegalStatusController.getAllLegalStatus);
router.get('/:id', LegalStatusController.getLegalStatusById);
router.post('/', LegalStatusController.createLegalStatus);
router.put('/:id', LegalStatusController.updateLegalStatus);
router.delete('/:id', LegalStatusController.deleteLegalStatus);

module.exports = router;
