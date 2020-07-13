const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const templating = require('./templating');

const isProduction = process.env.NODE_ENV === 'production';

const app = new Koa();

// log request URL
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}`);
});
// 生产环境静态文件是由部署在最前面的反向代理服务器处理的, node程序不需要处理静态文件
// 在开发环境下我们希望koa能顺带处理静态文件
if(!isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}
app.use(bodyParser());
// 集成nunjucks
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}))
// 将当前用户放入ctx.state中
/*
app.use(async (ctx, next) => {
    var user = tryGetUserFromCookie(ctx.request);
    if(user) {
        ctx.state.user = user;
        await next();
    } else {
        ctx.response.status = 403;
    }
});
*/
// add router middleware
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
