const fs = require('fs');


/**
 * Remove file
 * 
 * @param {string} filePath 
 * @returns {boolean}
 */
exports.removeFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, err => {
            if (err) {
                console.log(`Can't remove file "${filePath}"; Error: ${err.message}`);
                
                reject(false);
            } else {
                console.log(`File "${filePath}" removed successfully.`);

                resolve(true);
            }
        });
    });
};


/**
 * Get path file list
 * 
 * @param {string} path 
 * @returns {Array}
 */
exports.getFileList = (path) => {
    return fs.readdirSync(path);
};