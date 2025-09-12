const ProjectRepository = require('@repositories/project');
const ProjectEntity = require('@entities/Project');
const customErrors = require('@errors/customErrors');
const config = require('@config/index');

class Project {
    static async getAll({ page, limit }) {
        const safeLimit = limit ? Math.min(limit, config.pagination.maxLimit) : config.pagination.defaultLimit;
        const offset = (page - 1) * safeLimit;

        const total = await ProjectRepository.countAll();
        const projects = await ProjectRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { projects, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const projectData = await ProjectRepository.getById(id);
        if (!projectData) {
            throw new customErrors.ProjectNotFoundError('Project not found');
        }

        return new ProjectEntity(projectData);
    }

    static async create(data) {
        const entity = new ProjectEntity({
            name: data.name,
            startup_id: data.startup_id,
            project_status_id: data.project_status_id,
            needs: data.needs,
            sector_id: data.sector_id,
            maturity: data.maturity
        });

        const project = await ProjectRepository.create(entity.toObject());

        return new ProjectEntity(project);
    }

    static async update(id, data) {
        const project = await ProjectRepository.getById(id);
        if (!project) {
            throw new customErrors.ProjectNotFoundError('Project not found');
        }

        const updateFields = {};
        if (data.name) updateFields.name = data.name;
        if (data.startup_id) updateFields.startup_id = data.startup_id;
        if (data.project_status_id !== undefined) updateFields.project_status_id = data.project_status_id;
        if (data.needs) updateFields.needs = data.needs;
        if (data.sector_id !== undefined) updateFields.sector_id = data.sector_id;
        if (data.maturity) updateFields.maturity = data.maturity;

        const updated = await ProjectRepository.update(id, updateFields);

        return new ProjectEntity(updated);
    }

    static async delete(id) {
        const project = await ProjectRepository.getById(id);
        if (!project) {
            throw new customErrors.ProjectNotFoundError('Project not found');
        }

        await ProjectRepository.delete(id);
    }
}

module.exports = Project;
