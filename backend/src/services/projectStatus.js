const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const ProjectStatusRepository = require('@repositories/projectStatus');

class ProjectStatus {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await ProjectStatusRepository.countAll();
        const projectStatus = await ProjectStatusRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { projectStatus, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const projectStatusData = await ProjectStatusRepository.getById(id);
        if (!projectStatusData) {
            throw new customErrors.ProjectStatusNotFoundError('Project status not found');
        }

        return projectStatusData;
    }

    static async create(data) {
        const existing = await ProjectStatusRepository.getByName(data.name);
        if (existing) {
            throw new customErrors.ConflictError('Project status name already in use');
        }

        return ProjectStatusRepository.create(data);
    }

    static async update(id, data) {
        const existing = await ProjectStatusRepository.getById(id);
        if (!existing) {
            throw new customErrors.ProjectStatusNotFoundError('Project status not found');
        }

        const nameExists = await ProjectStatusRepository.getByName(data.name);
        if (nameExists && nameExists.id !== id) {
            throw new customErrors.ConflictError('Project status name already in use');
        }

        return await ProjectStatusRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await ProjectStatusRepository.getById(id);
        if (!existing) {
            throw new customErrors.ProjectStatusNotFoundError('Project status not found');
        }

        await ProjectStatusRepository.delete(id);
    }
}

module.exports = ProjectStatus;
