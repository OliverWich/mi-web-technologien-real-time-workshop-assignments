import {appendMessage, setConnectionStatus, setFormDisabledState, setOnSubmit} from "./client-utils.js";


// We dont want the user to think they can send messages before the connection is established.
setFormDisabledState(true)

// TODO Implement

// TODO 1: Create a new WebSocket connection

// TODO 1.1: Set the connection status to 'connecting' while the connection is being established

// TODO 1.2: Set the connection status to 'open' when the connection is established, 'error' when an error occurs, and 'close' when the connection is closed

// TODO 2: Handle incoming messages

// TODO 2.1: If the incoming message is a 'chat.initial' event, append each message to the chat window

// TODO 2.2: If the incoming message is a 'chat.message' event, append the message to the chat window

// TODO 3: Set form submit handler to send chat messages to the server