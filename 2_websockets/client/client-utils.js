const messages = document.getElementById('messages')
const form = document.getElementById('form')
const usernameInput = document.getElementById('username-input')
const messageInput = document.getElementById('message-input')
const button = form.querySelector('button')

const connectionMessage = document.getElementById('connection-status')

export function setFormDisabledState(state) {
    usernameInput.disabled = state
    messageInput.disabled = state
    button.disabled = state
}

export function setConnectionStatus(state) {
    switch (state) {
        case 'connecting':
            connectionMessage.innerText = "🔄 Connecting to server..."
            break;
        case 'open':
            connectionMessage.innerText = "🟢 Connected"
            break;
        case 'close':
            connectionMessage.innerText = "🔴 Disconnected"
            break;
        default:
            connectionMessage.innerText = `❌ Error during connection`
            break;
    }
}

export function appendMessage(username, message, timestamp) {
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')

    const usernameElement = document.createElement('p')
    usernameElement.classList.add('username')
    const timestampElement = document.createElement('p')
    timestampElement.classList.add('timestamp')

    const headerElement = document.createElement('div')
    headerElement.classList.add('header')
    headerElement.appendChild(usernameElement)
    headerElement.appendChild(timestampElement)

    const messageTextElement = document.createElement('p')
    messageTextElement.classList.add('message-text')

    usernameElement.innerText = username
    messageTextElement.innerText = message
    timestampElement.innerText = timestamp

    messageElement.appendChild(headerElement)
    messageElement.appendChild(messageTextElement)
    messages.appendChild(messageElement)

    messages.scrollTop = messages.scrollHeight
}

/**
 * @callback OnSubmitMethod
 * @param {string} username - The username
 * @param {string} message - The message typed in
 * @returns {void}
 */

/**
 * Set the form submit handler to send chat messages to the server
 * @param {OnSubmitMethod} callback
 */
export function setOnSubmit(callback) {
    form.addEventListener('submit', function (e) {
        e.preventDefault()
        callback(usernameInput.value, messageInput.value)
        messageInput.value = ''
    })
}