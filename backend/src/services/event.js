const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const EventRepository = require('@repositories/event');

class Event {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await EventRepository.countAll();
        const events = await EventRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { events, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const eventData = await EventRepository.getById(id);
        if (!eventData) {
            throw new customErrors.EventNotFoundError('Event not found');
        }

        return eventData;
    }

    static async create(data) {
        return EventRepository.create(data);
    }

    static async update(id, data) {
        const existing = await EventRepository.getById(id);
        if (!existing) {
            throw new customErrors.EventNotFoundError('Event not found');
        }

        await EventRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await EventRepository.getById(id);
        if (!existing) {
            throw new customErrors.EventNotFoundError('Event not found');
        }

        await EventRepository.delete(id);
    }
}

module.exports = Event;
