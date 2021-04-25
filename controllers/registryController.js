const fileService = require('../services/fileService');
const registryService = require('../services/registryService');

const BadRequestError = require('../common/errors/http/BadRequestError');
const InternalServerError = require('../common/errors/http/InternalServerError');


/**
 * Index
 * 
 * @param {*} ctx 
 * @param {*} next 
 */
exports.index = (ctx, next) => {
    ctx.body = {
        status: 'success',
        registries: registryService.getRegistryList(),
    }
};


/**
 * Upload registry
 * 
 * @param {*} ctx 
 * @param {*} next 
 */
exports.uploadRegistry = async (ctx, next) => {
    if (!ctx.req.file) {
        throw new BadRequestError(`File was not uploaded .`);
    }

    let fileName = ctx.req.file.filename;

    if (!fileName) {
        throw new BadRequestError(`Couldn't get name from uploaded file.`);
    }

    let registryData = await registryService.parseRegistry(fileName);
    let uniqueSpeed = registryService.getUniqueSpeed(registryData);

    ctx.body = {
        status: 'success',
        uniqueSpeedCount: uniqueSpeed.length,
    }
};


/**
 * Get registry data
 * 
 * @param {*} ctx 
 * @param {*} next 
 */
 exports.getRegistryData = async (ctx, next) => {
    let fileName = ctx.params.fileName;

    if (!fileName) {
        throw new BadRequestError(`File name not set.`);
    }

    if (false == registryService.isRegistryExists(fileName)) {
        throw new BadRequestError(`File "${fileName}" not found.`);
    }

    let registryData = await registryService.parseRegistry(fileName);
    let uniqueSpeed = registryService.getUniqueSpeed(registryData);
    
    ctx.body = {
        status: 'success',
        fileName: fileName,
        uniqueSpeedCount: uniqueSpeed.length,
        data: registryData,
    };
};


/**
 * Remove registry
 * 
 * @param {*} ctx 
 * @param {*} next 
 */
exports.removeRegistry = async (ctx, next) => {
    let fileName = ctx.params.fileName;

    if (!fileName) {
        throw new BadRequestError(`File name not set.`);
    }
    
    if (false == registryService.isRegistryExists(fileName)) {
        throw new BadRequestError(`File "${fileName}" not found.`);
    }

    let filePath = registryService.getRegistryPath(fileName);

    if (false == await fileService.removeFile(filePath)) {
        throw new InternalServerError(`Can't remove file "${fileName}".`);
    }

    ctx.body = {
        status: 'success',
        message: `File "${fileName}" removed successfully.`,
    };
};