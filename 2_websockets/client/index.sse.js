import {appendMessage, setConnectionStatus, setFormDisabledState, setOnSubmit} from "./client-utils.js";

setFormDisabledState(true)

// Create a new EventSource connection
const eventSource = new EventSource('http://localhost:8080/chat')
// Set the connection status to 'connecting' while the connection is being established
setConnectionStatus('connecting')

eventSource.onopen = () => {
    setConnectionStatus('open')
    setFormDisabledState(false)
}
eventSource.onerror = () => {
    setConnectionStatus('error')
    setFormDisabledState(true)
}

eventSource.addEventListener('chat.initial', (event) => {
    const messages = JSON.parse(event.data)
    messages.forEach(({username, message, timestamp}) => appendMessage(username, message, timestamp))
})

eventSource.addEventListener('chat.message', (event) => {
    const message = JSON.parse(event.data)
    appendMessage(message.username, message.message, message.timestamp)
})

// Set form submit handler to send chat messages to the server
setOnSubmit((username, message) => {
    return fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, message})
    })
})