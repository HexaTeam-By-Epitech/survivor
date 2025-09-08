const express = require('express');
const app = express();
require("module-alias/register");
const YAML = require("yamljs");
const PORT = 4242;

// Import swagger documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./doc/swagger.yaml");

// CORS middleware to allow frontend access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    
    next();
});

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données URL-encoded
app.use(express.urlencoded({ extended: true }));

// Swagger documentation route
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/users', require('@routes/user'));
app.use('/projects', require('@routes/project'));
app.use('/auth', require('@routes/auth'));
app.use('/startups', require('@routes/startup'));

// Add missing routes with placeholder responses for now
app.get('/events', (req, res) => {
    res.json({ data: [] });
});

app.get('/news', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/sectors', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/legal-statuses', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/partner-types', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/project-statuses', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/event-categories', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/target-audiences', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/investor-types', (req, res) => {
    res.json({ data: [] });
});

app.get('/reference/investment-focus', (req, res) => {
    res.json({ data: [] });
});

app.get('/', (req, res) => {
    res.send('Hello Otter World !');
});

// Only start the server when this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Minimal backend listening on port ${PORT}`);
    });
}

module.exports = app;
