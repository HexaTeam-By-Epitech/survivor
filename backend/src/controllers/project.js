const ProjectService = require('@services/project');

class Project {
    static async getAllProjects(req, res) {
        try {
            const projects = await ProjectService.getAllProjects();
            return res.json(projects);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await ProjectService.getProjectById(Number(id));
            if (!project) return res.status(404).json({ error: 'Project not found' });
            return res.json(project);
        } catch (error) {
            void error;
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createProject(req, res) {
        try {
            const project = await ProjectService.createProject(req.body);
            return res.status(201).json(project);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async updateProject(req, res) {
        try {
            const { id } = req.params;
            const updated = await ProjectService.updateProject(Number(id), req.body);
            if (!updated) return res.status(404).json({ error: 'Project not found' });
            return res.json(updated);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async deleteProject(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ProjectService.deleteProject(Number(id));
            if (!deleted) return res.status(404).json({ error: 'Project not found' });
            return res.status(204).send();
        } catch (error) {
            void error;
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = Project;
