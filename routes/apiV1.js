const Router = require('koa-router');
const apiV1_router = new Router();

// Import controllers
const registryController = require('../controllers/registryController');

// Import services
const { registryUploadHandler } = require('../services/registryService');

// Routing
apiV1_router

    .get('/registry', registryController.index)

    .post('/registry', registryUploadHandler.single('registry'), registryController.uploadRegistry)

    .get('/registry/:fileName', registryController.getRegistryData)

    .delete('/registry/:fileName', registryController.removeRegistry)

;

module.exports = apiV1_router;