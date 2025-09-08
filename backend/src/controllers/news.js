const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const NewsService = require('@services/news');

class News {
    static async getAllNews(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await NewsService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.news, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getNewById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const news = await NewsService.getById(id);

            return ApiResponse.success(res, news);
        } catch (error) {
            if (error instanceof customErrors.NewsNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'NEWS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createNew(req, res) {
        try {
            const data = req.body;
            const news = await NewsService.create(data);

            return ApiResponse.success(res, news);
        } catch (error) {
            if (error instanceof customErrors.NewsNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'NEWS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateNew(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await NewsService.update(id, data);

            return ApiResponse.success(res, null, 'News updated successfully');
        } catch (error) {
            if (error instanceof customErrors.NewsNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'NEWS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteNew(req, res) {
        try {
            const id = parseInt(req.params.id);
            await NewsService.delete(id);

            return ApiResponse.success(res, null, 'News deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.NewsNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'NEWS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = News;
