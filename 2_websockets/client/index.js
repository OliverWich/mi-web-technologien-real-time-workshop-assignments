import {appendMessage, setConnectionStatus, setFormDisabledState, setOnSubmit} from "./client-utils.js";


// We dont want the user to think they can send messages before the connection is established.
setFormDisabledState(true)

const ws = new WebSocket('ws://localhost:8080')

setConnectionStatus('connecting')

// Set the connection status to 'open' when the connection is established, 'error' when an error occurs, and 'close' when the connection is closed
ws.addEventListener('open', () => {
    setConnectionStatus('open')
    setFormDisabledState(false)
})

ws.addEventListener('error', () => {
    setConnectionStatus('error')
    setFormDisabledState(true)
})

ws.addEventListener('close', () => {
    setConnectionStatus('close')
    setFormDisabledState(true)
})

// Handle incoming messages
ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.event === 'chat.initial') {
        message.data.forEach(individualMessage => {
            appendMessage(individualMessage.username, individualMessage.message, individualMessage.timestamp)
        })
    } else if (message.event === 'chat.message') {
        appendMessage(message.data.username, message.data.message, message.data.timestamp)
    }
})

setOnSubmit((username, message) => {
    ws.send(JSON.stringify({
        event: 'chat',
        data: {
            username: username,
            message: message
        }
    }))
})
