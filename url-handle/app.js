const Koa = require('koa');
// router的相关逻辑被封装到了controller.js中
// const router = require('koa-router')(); 
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');

const app = new Koa();

// log request URL
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
    await next();
});
// 由于middleware的顺序, koa-bodyparser必须在router之前被注册到app对象上
app.use(bodyParser());
// add router middleware
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
