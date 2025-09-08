const StartupService = require("@services/startupService");

class StartupController {
    static async getAll(req, res) {
        try {
            const startups = await StartupService.getAll();
            res.json({ data: startups });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const startup = await StartupService.getById(parseInt(id));
            if (!startup) return res.status(404).json({ error: "Startup not found" });
            res.json({ data: startup });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const updated = await StartupService.update(parseInt(id), req.body);
            res.json({ data: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await StartupService.delete(parseInt(id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = StartupController;
