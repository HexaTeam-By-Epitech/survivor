const express = require('express');
const app = express();
require("module-alias/register");
const YAML = require("yamljs");
const PORT = 4242;

// Import swagger documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./doc/swagger.yaml");

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
app.use('/events', require('@routes/event'));
app.use('/news', require('@routes/news'));
app.use('/sectors', require('@routes/sector'));
app.use('/event-categories', require('@routes/eventCategory'));
app.use('/partner-types', require('@routes/partnerType'));

app.get('/', (req, res) => {
    res.send('Hello World !');
});

// Only start the server when this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT}`);
    });
}

module.exports = app;
