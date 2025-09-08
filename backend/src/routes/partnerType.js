const express = require('express');
const router = express.Router();
const PartnerTypeController = require('@controllers/partnerType');

router.get('/', PartnerTypeController.getAllPartnerTypes);
router.get('/:id', PartnerTypeController.getPartnerTypeById);
router.post('/', PartnerTypeController.createPartnerType);
router.put('/:id', PartnerTypeController.updatePartnerType);
router.delete('/:id', PartnerTypeController.deletePartnerType);

module.exports = router;
