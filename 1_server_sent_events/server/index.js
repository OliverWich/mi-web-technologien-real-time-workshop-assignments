import * as http from 'http';
import {handleSSERoute} from "./sse-route.js";

// Create HTTP server
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow only GET method
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.url === '/sse') {
        return handleSSERoute(req, res);
    }

    // Handle other routes
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
