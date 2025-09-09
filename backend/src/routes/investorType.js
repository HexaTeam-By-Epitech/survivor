const express = require('express');
const router = express.Router();
const InvestorTypeController = require('@controllers/investorType');

router.get('/', InvestorTypeController.getAllInvestorTypes);
router.get('/:id', InvestorTypeController.getInvestorTypeById);
router.post('/', InvestorTypeController.createInvestorType);
router.put('/:id', InvestorTypeController.updateInvestorType);
router.delete('/:id', InvestorTypeController.deleteInvestorType);

module.exports = router;
