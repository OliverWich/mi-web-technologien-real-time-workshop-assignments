import * as http from 'http';

const newTimeStamp = () => {
    const date = new Date()
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")

    return `${day}.${month}.${year} ${hour}:${minute}:${seconds}`
}


// Stores all currently connected websocket clients
const chatListeners = []
// Stores all chat messages (view it as the best DB ever)
const messages = []

// Helper function to emit messages to all connected clients
function broadcastMessage(event, data) {
    chatListeners.forEach(listener => listener(event, data))
}

// Create HTTP server
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow only GET method
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.url === '/chat') {

        // Handle preflight request (send because of CORS)
        if(req.method === "OPTIONS") {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('OK');
            return;
        }

        if (req.method === 'GET') {
            // Handle chat route
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            res.write(`event: chat.initial\ndata: ${JSON.stringify(messages)}\n\n`);

            // Add listener for new chat messages
            const listener = (event, data) => {
                res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
            }
            chatListeners.push(listener);

            // Remove listener when connection is closed
            req.on('close', () => {
                const index = chatListeners.indexOf(listener);
                chatListeners.splice(index, 1);
            });
            return;
        }

        if (req.method === 'POST') {
            // Handle chat message
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const {username, message} = JSON.parse(body);

                const newMessage = {username, message, timestamp: newTimeStamp()};
                messages.push(newMessage);

                broadcastMessage('chat.message', newMessage);

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('OK');
            });
            return;
        }
    }

    // Handle other routes
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
});

// Start server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});