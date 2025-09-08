class ProjectEntity {
    constructor({
        id = null,
        startup_id,
        name,
        project_status_id = null,
        needs = "",
        sector_id = null,
        maturity = ""
    }) {
        if (!startup_id) throw new Error("Startup ID is required");
        if (!name) throw new Error("Project name is required");

        this.id = id;
        this.startup_id = startup_id;
        this.name = name;
        this.project_status_id = project_status_id;
        this.needs = needs;
        this.sector_id = sector_id;
        this.maturity = maturity;
    }

    toObject() {
        const obj = {
            startup_id: this.startup_id,
            name: this.name,
            project_status_id: this.project_status_id,
            needs: this.needs,
            sector_id: this.sector_id,
            maturity: this.maturity
        };

        // Only include id if it's set (for updates)
        if (this.id !== null) {
            obj.id = this.id;
        }

        return obj;
    }
}

module.exports = ProjectEntity;
