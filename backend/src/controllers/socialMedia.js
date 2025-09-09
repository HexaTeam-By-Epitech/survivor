const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const SocialMediaService = require('@services/socialMedia');

class SocialMedia {
    static async getAllSocialMedias(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await SocialMediaService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.socialMedias, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getSocialMediaById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const socialMedia = await SocialMediaService.getById(id);

            return ApiResponse.success(res, socialMedia);
        } catch (error) {
            if (error instanceof customErrors.SocialMediaNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'SOCIAL_MEDIA_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createSocialMedia(req, res) {
        try {
            const data = req.body;
            const socialMedia = await SocialMediaService.create(data);

            return ApiResponse.success(res, socialMedia);
        } catch (error) {
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'SOCIAL_MEDIA_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateSocialMedia(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await SocialMediaService.update(id, data);

            return ApiResponse.success(res, null, 'Social media updated successfully');
        } catch (error) {
            if (error instanceof customErrors.SocialMediaNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'SOCIAL_MEDIA_NOT_FOUND');
            }
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'SOCIAL_MEDIA_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteSocialMedia(req, res) {
        try {
            const id = parseInt(req.params.id);

            await SocialMediaService.delete(id);

            return ApiResponse.success(res, null, 'Social media deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.SocialMediaNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'SOCIAL_MEDIA_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = SocialMedia;
