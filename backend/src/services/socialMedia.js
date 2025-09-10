const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const SocialMediaRepository = require('@repositories/socialMedia');

class SocialMedia {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await SocialMediaRepository.countAll();
        const socialMedias = await SocialMediaRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { socialMedias, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const socialMediaData = await SocialMediaRepository.getById(id);
        if (!socialMediaData) {
            throw new customErrors.SocialMediaNotFoundError('Social media not found');
        }

        return socialMediaData;
    }

    static async create(data) {
        return SocialMediaRepository.create(data);
    }

    static async update(id, data) {
        const existing = await SocialMediaRepository.getById(id);
        if (!existing) {
            throw new customErrors.SocialMediaNotFoundError('Social media not found');
        }

        return await SocialMediaRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await SocialMediaRepository.getById(id);
        if (!existing) {
            throw new customErrors.SocialMediaNotFoundError('Social media not found');
        }

        await SocialMediaRepository.delete(id);
    }
}

module.exports = SocialMedia;
