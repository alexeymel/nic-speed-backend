const os = require('os');
const Koa = require('koa');
const Router = require('koa-router');

require(`dotenv-defaults`).config({
    path: './.env',
    encoding: 'utf8',
    defaults: './.env.defaults',
});

const dateService = require('./services/dateService');

// Create main app
const app = new Koa();

// Create main app router
const appRouter = new Router();

// Use custom error handler
const { errorHandler } = require('./services/errorService');
app.use(errorHandler);

// Preset for main app
app.use(async (ctx, next) => {
    let time = dateService.dateToSimpleDatetime(new Date());
    console.log(`${time} => ${ctx.method} ${ctx.path}`);

    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    ctx.set('Content-Type', 'application/json');

    await next();
});

// Load routes
const apiV1_router = require('./routes/apiV1');

appRouter.use('/api/v1', apiV1_router.routes());

app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

// Start server
app.listen(process.env.SERVER_PORT, () => {
    console.log(`${os.EOL}Route list:`)
    appRouter.stack.forEach((route) => {
        console.log(`${route.methods} ${route.path}`);
    });

    console.log(`${os.EOL}Server start on http://${os.hostname}:${process.env.SERVER_PORT}${os.EOL}`);
});