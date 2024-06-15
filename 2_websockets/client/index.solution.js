import {appendMessage, setConnectionStatus, setFormDisabledState, setOnSubmit} from "./client-utils.js";

setFormDisabledState(true)

// Create a new WebSocket connection
const ws = new WebSocket('ws://localhost:8080')
// Set the connection status to 'connecting' while the connection is being established
setConnectionStatus('connecting')

// Set the connection status to 'open' when the connection is established
ws.onopen = () => {
    setConnectionStatus('open')
    setFormDisabledState(false)
}
// Set the connection status to 'error' when an error occurs
ws.onerror = () => {
    setConnectionStatus('error')
    setFormDisabledState(true)
}
// Set the connection status to 'close' when the connection is closed
ws.onclose = () => {
    setConnectionStatus('close')
    setFormDisabledState(true)
}

// Handle incoming messages
ws.onmessage = (event) => {
    const wsFrame = JSON.parse(event.data)

    // If the incoming message is a 'chat.initial' event, append each message to the chat window
    if(wsFrame.event === "chat.initial") wsFrame.data.forEach(({username, message, timestamp}) => appendMessage(username, message, timestamp))
    // If the incoming message is a 'chat.message' event, append the message to the chat window
    if(wsFrame.event === "chat.message") appendMessage(wsFrame.data.username, wsFrame.data.message, wsFrame.data.timestamp)
}

// Set form submit handler to send chat messages to the server
setOnSubmit((username, message) => {
    ws.send(JSON.stringify({
        event: 'chat',
        data: {username, message}
    }))
})