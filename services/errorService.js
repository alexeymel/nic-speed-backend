 /**
  * Custom error handler
  * 
  * @param {*} ctx 
  * @param {*} next 
  */
 const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = {
            status: 'error',
            message: error.message
        };
    }
};


exports.errorHandler = errorHandler;