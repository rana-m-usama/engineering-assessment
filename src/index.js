const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/items', require('./routes/items'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/UsamaApiTest', require('./routes/usamaApiTest'));

// Swagger UI (single endpoint documented)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.get('/', (_req, res) => {
    res.json({ ok: true, docs: '/api-docs', endpoint: '/api/UsamaApiTest' });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
