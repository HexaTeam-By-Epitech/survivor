const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const EventCategoryService = require('@services/eventCategory');

class EventCategory {
    static async getAllEventsCategories(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await EventCategoryService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.categories, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getEventCategoryById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const category = await EventCategoryService.getById(id);

            return ApiResponse.success(res, category);
        } catch (error) {
            if (error instanceof customErrors.EventCategoryNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'EVENTS_CATEGORY_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createEventCategory(req, res) {
        try {
            const data = req.body;
            const category = await EventCategoryService.create(data);

            return ApiResponse.success(res, category);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateEventCategory(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await EventCategoryService.update(id, data);

            return ApiResponse.success(res, null, 'Event category updated successfully');
        } catch (error) {
            if (error instanceof customErrors.EventCategoryNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'EVENTS_CATEGORY_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteEventCategory(req, res) {
        try {
            const id = parseInt(req.params.id);

            await EventCategoryService.delete(id);

            return ApiResponse.success(res, null, 'Event category deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.EventCategoryNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'EVENTS_CATEGORY_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = EventCategory;
