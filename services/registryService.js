const fs = require('fs');
const path = require('path');
const multer = require('koa-multer');
const csvParser = require('fast-csv');

const fileService = require('./fileService');
const dateService = require('./dateService');

const BadRequestError = require('../common/errors/http/BadRequestError');

const MIMETYPE_CSV = 'text/csv';
const REGISTRY_IGNORE = ['.gitignore'];
const REGISTRY_UPLOAD_PATH = process.env.REGISTRY_UPLOAD_PATH;
const REGISTRY_COLUMN_DELIMITER = process.env.REGISTRY_COLUMN_DELIMITER;


/**
 * Get registry file path
 * 
 * @param {string} registryFileName 
 * @returns 
 */
function getRegistryPath(registryFileName) {
    return path.resolve(REGISTRY_UPLOAD_PATH, registryFileName);
};


/**
 * Get registry list
 * 
 * @returns {array}
 */
function getRegistryList() {
    let registries = [];
    
    fileService.getFileList(REGISTRY_UPLOAD_PATH).forEach(fileName => {
        if (REGISTRY_IGNORE.indexOf(fileName) == -1) {
            let filePath = getRegistryPath(fileName);
            let fileStat = fs.statSync(filePath);

            registries.push({
                fileName: fileName,
                date: dateService.dateToSimpleDatetime(fileStat.birthtime),
                size: fileStat.size,
            });
        };
    });

    return registries;
}


/**
 * Regitry upload handler
 */
const registryUploadHandler = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, REGISTRY_UPLOAD_PATH);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname.replace(' ', '_'))
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype == MIMETYPE_CSV) {
            cb(null, true);
        } else {
            let BadRequestError = require('../common/errors/http/BadRequestError');

            cb(new BadRequestError(`File must be a "${MIMETYPE_CSV}" mime type.`), false);
        }
    },
});


/**
 * Parse registry data from .csv file
 * 
 * @param {string} fileName 
 * @returns {Array}
 */
async function parseRegistry(fileName) {
    return new Promise((resolve, reject) => {
        if (!fileName) {
            console.log('Parser error: empty file name');
            reject(new Error('Empty file name.'));
        }

        console.log(`Start parsing registry "${fileName}".`);

        let registryData = Array();
        let filePath = getRegistryPath(fileName);

        let parserOptions = {
            headers: ['hostname', 'nic', 'speed'],
            renameHeaders: true,
            delimiter: REGISTRY_COLUMN_DELIMITER,
            ignoreEmpty: true,
            trim: true,
        };
        
        csvParser.parseFile(filePath, parserOptions).on('data', row => {
            registryData.push(row);
        }).on('end', rowCount => {
            console.log(`Parsed ${rowCount} rows.`);
            resolve(registryData);
        }).on('error', error => {
            console.log(`Parser error: ${error.message}`);
            reject(new Error(error.message));
        });
    });
};


/**
 * Get unique speed
 * 
 * @param {Array} registryData 
 * @returns {Array}
 */
function getUniqueSpeed(registryData) {
    let distinctSpeed = Array();

    registryData.forEach(row => {
        if (row.speed === undefined || row.speed === '') {
            return;
        }

        if (distinctSpeed.indexOf(row.speed) == -1) {
            distinctSpeed.push(row.speed);
        }
    });

    return distinctSpeed;
};


/**
 * Check registry exists on the file system
 * 
 * @param {string} fileName 
 * @returns {boolean}
 */
function isRegistryExists(fileName) {
    if (!fileName) {
        return false;
    }

    let filePath = getRegistryPath(fileName);

    return fs.existsSync(filePath);
};


exports.getRegistryPath = getRegistryPath;
exports.getRegistryList = getRegistryList;
exports.registryUploadHandler = registryUploadHandler;
exports.parseRegistry = parseRegistry;
exports.getUniqueSpeed = getUniqueSpeed;
exports.isRegistryExists = isRegistryExists;