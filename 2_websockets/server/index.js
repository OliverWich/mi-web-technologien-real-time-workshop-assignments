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

// TODO Implement

// TODO 1: Create websocket server

// TODO 2: Handle new connections

// TODO 2.1: Send initial data to new connection

// TODO 2.2: Handle incoming messages from new connection

// TODO 2.3: Handle client disconnection (if needed)

// TODO 3: Add debug message to see if server is running