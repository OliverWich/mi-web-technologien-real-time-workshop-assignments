import {WebSocketServer} from 'ws'

const newTimeStamp = () => {
    const date = new Date()
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${day}.${month}.${year} ${hour}:${minute}:${seconds}`
}

// All the messages that have been sent. To get new clients up to speed
const messages = []

// All the clients that are connected. We need to keep track of them to send messages to all of them
const clients = []

const server = new WebSocketServer({port: 8080})

// "Broadcast" a message to all connected clients
function sendMessageToAll(eventType = 'chat.message', data = {}) {
    clients.forEach(client => {
        client.send(JSON.stringify({
            event: eventType,
            data
        }))
    })
}

server.on('listening', () => {
    console.log('Server is running')
})

server.on('connection', (ws) => {
    console.log('Client connected')

    clients.push(ws)

    ws.send(JSON.stringify({
        event: 'chat.initial',
        data: messages
    }))

    ws.on('message', (message) => {
        const parsed = JSON.parse(message)
        console.log('Message received:', parsed)

        if (parsed.event !== 'chat') return

        const messageWithTimeStamp = {
            ...parsed.data,
            timestamp: newTimeStamp()
        }
        messages.push(messageWithTimeStamp)

        sendMessageToAll('chat.message', messageWithTimeStamp)
    })

    ws.on('close', () => {
        const index = clients.indexOf(ws)
        clients.splice(index, 1)
    })
})
