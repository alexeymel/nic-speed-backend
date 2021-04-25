const { StatusCodes } = require('http-status-codes');


/**
 * Inernal server error
 */
module.exports = class InternalServerError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}