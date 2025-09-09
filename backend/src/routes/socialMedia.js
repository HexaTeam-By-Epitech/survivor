const express = require('express');
const router = express.Router();
const SocialMediaController = require('@controllers/socialMedia');

router.get('/', SocialMediaController.getAllSocialMedias);
router.get('/:id', SocialMediaController.getSocialMediaById);
router.post('/', SocialMediaController.createSocialMedia);
router.put('/:id', SocialMediaController.updateSocialMedia);
router.delete('/:id', SocialMediaController.deleteSocialMedia);

module.exports = router;
