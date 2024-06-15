import {WebSocketServer} from 'ws';

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
const clients = []
// Stores all chat messages (view it as the best DB ever)
const messages = []

// Helper function to emit messages to all connected clients
function broadcastMessage(event, data) {
    clients.forEach(ws => ws.send(JSON.stringify({event, data})))
}

// Create websocket server
const server = new WebSocketServer({port: 8080})

// Handle new connections
server.on('connection', (webSocket) => {
    // Register new connection
    clients.push(webSocket)

    // Send initial data to new connection
    webSocket.send(JSON.stringify({event: 'chat.initial', data: messages}))

    // Handle incoming messages from new connection
    webSocket.on('message', (message) => {
        const {event, data} = JSON.parse(message)

        // We only care about chat messages
        if (event !== 'chat') {
            return;
        }

        // We add the timestamp serverside
        const newMessage = {username: data.username, message: data.message, timestamp: newTimeStamp()}
        // Make sure the history is recorded for new clients
        messages.push(newMessage)

        // Broadcast the new message to all clients
        broadcastMessage('chat.message', newMessage)
    })

    // Handle client disconnection
    webSocket.on('close', () => {
        // We need to remove stale connections
        const index = clients.indexOf(webSocket)
        clients.splice(index, 1)
    })
})

// Add debug message to see if server is running
server.on('listening', () => {
    console.log('Server is listening on port 8080')
})