const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const EventService = require('@services/user');

class Event {
    static async getAllEvents(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await EventService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.events, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getEventById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const event = await EventService.getById(id);

            return ApiResponse.success(res, event);
        } catch (error) {
            if (error instanceof customErrors.EventNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'EVENT_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createEvent(req, res) {
        try {
            const data = req.body;
            const event = await EventService.create(data);

            return ApiResponse.success(res, event);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateEvent(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await EventService.update(id, data);

            return ApiResponse.success(res, null, 'Event updated successfully');
        } catch (error) {
            if (error instanceof customErrors.EventNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'EVENT_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteEvent(req, res) {
        try {
            const id = parseInt(req.params.id);
            await EventService.delete(id);

            return ApiResponse.success(res, null, 'Event deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.EventNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'EVENT_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = Event;
