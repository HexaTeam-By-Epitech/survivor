const express = require('express');
const router = express.Router();
const ProjectStatusController = require('@controllers/projectStatus');

router.get('/', ProjectStatusController.getAllProjectStatus);
router.get('/:id', ProjectStatusController.getProjectStatusById);
router.post('/', ProjectStatusController.createProjectStatus);
router.put('/:id', ProjectStatusController.updateProjectStatus);
router.delete('/:id', ProjectStatusController.deleteProjectStatus);

module.exports = router;
