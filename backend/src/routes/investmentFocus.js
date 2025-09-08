const express = require('express');
const router = express.Router();
const InvestmentFocusController = require('@controllers/investmentFocus');

router.get('/', InvestmentFocusController.getAllInvestmentFocus);
router.get('/:id', InvestmentFocusController.getInvestmentFocusById);
router.post('/', InvestmentFocusController.createInvestmentFocus);
router.put('/:id', InvestmentFocusController.updateInvestmentFocus);
router.delete('/:id', InvestmentFocusController.deleteInvestmentFocus);

module.exports = router;
