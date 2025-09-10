const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const ProjectStatusService = require('@services/projectStatus');

class ProjectStatus {
    static async getAllProjectStatus(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await ProjectStatusService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.projectStatus, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getProjectStatusById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const projectStatus = await ProjectStatusService.getById(id);

            return ApiResponse.success(res, projectStatus);
        } catch (error) {
            if (error instanceof customErrors.ProjectStatusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PROJECT_STATUS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createProjectStatus(req, res) {
        try {
            const data = req.body;
            const projectStatus = await ProjectStatusService.create(data);

            return ApiResponse.success(res, projectStatus);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateProjectStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await ProjectStatusService.update(id, data);

            return ApiResponse.success(res, null, 'Project status updated successfully');
        } catch (error) {
            if (error instanceof customErrors.ProjectStatusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PROJECT_STATUS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteProjectStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            await ProjectStatusService.delete(id);

            return ApiResponse.success(res, null, 'Project status deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.ProjectStatusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PROJECT_STATUS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = ProjectStatus;
