const ProjectRepository = require('@repositories/project');
const ProjectEntity = require('@entities/Project');

class Project {
    static async getAllProjects() {
        const projectRepo = new ProjectRepository();
        return await projectRepo.findAll();
    }

    static async getProjectById(id) {
        const projectRepo = new ProjectRepository();
        return await projectRepo.findById(id);
    }

    static async createProject(data) {
        const entity = new ProjectEntity({
            id: data.id || null,
            name: data.name,
            startup_id: data.startup_id,
            project_status_id: data.project_status_id,
            needs: data.needs,
            sector_id: data.sector_id,
            maturity: data.maturity
        });

        const projectRepo = new ProjectRepository();
        return await projectRepo.create({ data: entity.toObject() });
    }

    static async updateProject(id, data) {
        const projectRepo = new ProjectRepository();
        const exists = await projectRepo.findById(id);
        if (!exists) return null;

        const updateData = {};
        if (data.name) updateData.name = data.name;
        if (data.startup_id) updateData.startup_id = data.startup_id;
        if (data.project_status_id !== undefined) updateData.project_status_id = data.project_status_id;
        if (data.needs) updateData.needs = data.needs;
        if (data.sector_id !== undefined) updateData.sector_id = data.sector_id;
        if (data.maturity) updateData.maturity = data.maturity;

        return await projectRepo.update(id, updateData);
    }

    static async deleteProject(id) {
        const projectRepo = new ProjectRepository();
        const exists = await projectRepo.findById(id);
        if (!exists) return null;
        return await projectRepo.delete(id);
    }
}

module.exports = Project;
