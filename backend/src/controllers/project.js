const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const ProjectService = require('@services/project');

class Project {
    static async getAllProjects(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await ProjectService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.projects, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getProjectById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const project = await ProjectService.getById(id);

            return ApiResponse.success(res, project);
        } catch (error) {
            if (error instanceof customErrors.ProjectNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PROJECT_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createProject(req, res) {
        try {
            const data = req.body;
            const project = await ProjectService.create(data);

            return ApiResponse.success(res, project, 'Project created successfully');
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateProject(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await ProjectService.update(id, data);

            return ApiResponse.success(res, null, 'Project updated successfully');
        } catch (error) {
            if (error instanceof customErrors.ProjectNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PROJECT_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteProject(req, res) {
        try {
            const id = parseInt(req.params.id);

            await ProjectService.delete(id);

            return ApiResponse.success(res, null, 'Project deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.ProjectNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PROJECT_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = Project;
