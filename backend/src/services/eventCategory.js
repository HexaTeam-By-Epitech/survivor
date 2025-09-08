const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const EventCategoryRepository = require('@repositories/eventCategory');

class EventCategory {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await EventCategoryRepository.countAll();
        const categories = await EventCategoryRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { categories, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const categoryData = await EventCategoryRepository.getById(id);
        if (!categoryData) {
            throw new customErrors.EventCategoryNotFoundError('Event category not found');
        }

        return categoryData;
    }

    static async create(data) {
        const existing = await EventCategoryRepository.getByName(data.name);
        if (existing) {
            throw new customErrors.ConflictError('Event category name already in use');
        }

        return EventCategoryRepository.create(data);
    }

    static async update(id, data) {
        const existing = await EventCategoryRepository.getById(id);
        if (!existing) {
            throw new customErrors.SectorNotFoundError('Event category not found');
        }

        const nameExists = await EventCategoryRepository.getByName(data.name);
        if (nameExists && nameExists.id !== id) {
            throw new customErrors.ConflictError('Sector name already in use');
        }

        return await EventCategoryRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await EventCategoryRepository.getById(id);
        if (!existing) {
            throw new customErrors.EventCategoryNotFoundError('Event category not found');
        }

        await EventCategoryRepository.delete(id);
    }
}

module.exports = EventCategory;
