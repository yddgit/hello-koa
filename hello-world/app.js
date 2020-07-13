/**
 * 执行方式:
 * 1. node app.js
 * 2. npm start
 * 3. 在VSCode中执行app.js
 */

// 导入koa, 因为导入的是一个class, 因此用大写的Koa表示
const Koa = require('koa');
// 创建一个Koa对象表示webapp本身
const app = new Koa();
// 对于任何请求, app将调用该异步函数处理请求
// 1. ctx是由koa传入的封装了request和response的变量, 可以通过它访问request和response
// 2. next是koa传入的将要处理的下一个异步函数
// 3. 由async标记的函数称为异步函数, 在异步函数中, 可以用await调用另一个异步函数

app.use(async (ctx, next) => {
    // ctx.request.url也可写作ctx.url
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});

app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗时
});

app.use(async (ctx, next) => {
    // 先处理下一个异步函数, 原因是:
    // koa把很多async函数组成一个处理链, 每个async函数都可以做一些自己的事情, 然后用await next()来调用上一个async函数
    // 这里把每个async函数称为middleware, 这些middleware可以组合起来, 完成很多有用的功能
    // middleware的顺序很重要, 也就是调用app.use()的顺序决定middleware的顺序
    // 如果没有调用await next(), 则后续的middleware将不再执行, 例如检测用户权限的middleware可以决定是否继续处理请求还是直接返回403错误
    /*
    if(await checkUserPermisson(ctx)) {
        await next();
    } else {
        ctx.response.status = 403;
    }
    */
    await next();
    // 设置response的Content-Type
    // ctx.response.type也可写作ctx.type
    ctx.response.type = 'text/html';
    // 设置response的内容
    ctx.response.body = '<h1>Hello koa2</h1>';
});
// 在端口3000监听
app.listen(3000);
console.log('app started at port 3000...');


