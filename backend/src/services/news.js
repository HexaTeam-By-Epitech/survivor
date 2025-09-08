const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const NewsRepository = require('@repositories/news');

class News {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await NewsRepository.countAll();
        const news = await NewsRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { news, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const newsItem = await NewsRepository.getById(id);
        if (!newsItem) {
            throw new customErrors.NewsNotFoundError('News not found');
        }

        return newsItem;
    }

    static async create(data) {
        return await NewsRepository.create({
            company_id: data.company_id,
            title: data.title,
            description: data.description,
            location: data.location
        });
    }

    static async update(id, data) {
        const newsItem = await NewsRepository.getById(id);
        if (!newsItem) {
            throw new customErrors.NewsNotFoundError('News not found');
        }

        const updateData = {};
        if (data.title) updateData.title = data.title;
        if (data.description) updateData.description = data.description;
        if (data.location) updateData.location = data.location;

        return await NewsRepository.update(id, updateData);
    }

    static async delete(id) {
        const newsItem = await NewsRepository.getById(id);
        if (!newsItem) {
            throw new customErrors.NewsNotFoundError('News not found');
        }

        return await NewsRepository.delete(id);
    }
}

module.exports = News;
