const { StatusCodes } = require('http-status-codes');


/**
 * Bad request error
 */
module.exports = class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = StatusCodes.BAD_REQUEST;
    }
}