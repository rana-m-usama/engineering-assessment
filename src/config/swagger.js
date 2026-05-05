const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const spec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Engineering Assessment API',
            version: '1.0.0',
            description: 'Single endpoint that reads ERC-20 token state from a Sepolia contract.',
        },
    },
    // Only document the assessment's single endpoint.
    apis: [path.join(__dirname, '../routes/usamaApiTest.js')],
});

module.exports = spec;
