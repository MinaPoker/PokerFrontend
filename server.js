const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === '/create') {
            console.log("socket running :", pathname)
        } else if (pathname === '/game') {
            console.log("socket running :", pathname)
            app.render(req, res, '/b', query);
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(5005, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:5005');
    });
});
