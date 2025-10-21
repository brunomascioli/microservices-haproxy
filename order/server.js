const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        console.log(`Health check received on the ORDER server from ${req.socket.remoteAddress}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK\n');
    
    } else if (req.url === '/api/v1') {
        console.log(`Request received for /api/v1 on the ORDER server from ${req.socket.remoteAddress}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Response from the ORDER server API v1.\n');

    } else {
        console.log(`Route not found for ${req.url} on the ORDER server`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found\n');
    }
});

server.listen(port, () => {
    console.log(`ORDER server started and listening on port ${port}...`);
});
