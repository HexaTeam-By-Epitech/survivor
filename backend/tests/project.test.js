const request = require('supertest');
const app = require('../app');

describe('Project API Endpoints', () => {
	// Generate unique names for each test run
	const timestamp = Date.now();

	describe('GET /projects', () => {
		it('should return all projects', async () => {
			const response = await request(app).get('/projects').expect(200);

			expect(Array.isArray(response.body)).toBe(true);
		});
	});

	describe('POST /projects', () => {
		it('should create a new project with valid data', async () => {
			const projectData = {
				startup_id: 1,
				name: `Test Project ${timestamp}`,
				needs: 'Funding and technical support',
				maturity: 'MVP'
			};

			const response =
				await request(app).post('/projects').send(projectData).expect(201);

			expect(response.body).toHaveProperty('id');
			expect(response.body.name).toBe(projectData.name);
			expect(response.body.startup_id).toBe(projectData.startup_id);
		});

		it('should return 400 for missing required fields', async () => {
			const invalidProjectData = {
				name: `Invalid Test Project ${timestamp}`
				// Missing startup_id
			};

			await request(app).post('/projects').send(invalidProjectData).expect(400);
		});
	});

	describe('GET /projects/:id', () => {
		it('should return a specific project by ID', async () => {
			// First create a project
			const projectData = {
				startup_id: 1,
				name: `Test Project for Get ${timestamp}`,
				needs: 'Testing',
				maturity: 'Prototype'
			};

			const createResponse =
				await request(app).post('/projects').send(projectData);

			const projectId = createResponse.body.id;

			// Then get it by ID
			const response =
				await request(app).get(`/projects/${projectId}`).expect(200);

			expect(response.body.id).toBe(projectId);
			expect(response.body.name).toBe(projectData.name);
		});

		it('should return 404 for non-existent project', async () => {
			await request(app).get('/projects/99999').expect(404);
		});
	});

	describe('PUT /projects/:id', () => {
		it('should update an existing project', async () => {
			// First create a project
			const projectData = {
				startup_id: 1,
				name: `Original Project Name ${timestamp}`,
				needs: 'Original needs',
				maturity: 'Idea'
			};

			const createResponse =
				await request(app).post('/projects').send(projectData);

			const projectId = createResponse.body.id;

			// Then update it
			const updateData = {
				name: `Updated Project Name ${timestamp}`,
				maturity: 'MVP'
			};

			const response = await request(app)
				.put(`/projects/${projectId}`)
				.send(updateData)
				.expect(200);

			expect(response.body.name).toBe(updateData.name);
			expect(response.body.maturity).toBe(updateData.maturity);
		});

		it('should return 404 for non-existent project', async () => {
			const updateData = { name: `Updated Name ${timestamp}` };

			await request(app).put('/projects/99999').send(updateData).expect(404);
		});
	});

	describe('DELETE /projects/:id', () => {
		it('should delete an existing project', async () => {
			// First create a project
			const projectData = {
				startup_id: 1,
				name: `Project to Delete ${timestamp}`,
				needs: 'Will be deleted',
				maturity: 'Concept'
			};
			const createResponse =
				await request(app).post("/projects").send(projectData);
			const projectId = createResponse.body.id;
			// Then delete it
			await request(app).delete(`/projects/${projectId}`).expect(204);
			// Verify it's deleted
			await request(app).get(`/projects/${projectId}`).expect(404);
		});

		it("should return 404 for non-existent project", async () => {
			await request(app).delete("/projects/99999").expect(404);
		});
	});
});
