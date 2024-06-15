import http from 'http';
import crypto from 'crypto';

// Function to generate Sec-WebSocket-Accept value
function generateAcceptValue(secWebSocketKey) {
    return crypto
        .createHash('sha1')
        .update(secWebSocketKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
        .digest('base64');
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end();
});

// Handle WebSocket connections
// TODO Do, but do not use
server.on('upgrade', (req, socket, head) => {
    const secWebSocketKey = req.headers['sec-websocket-key'];
    const secWebSocketAccept = generateAcceptValue(secWebSocketKey);
    const secWebSocketVersion = req.headers['sec-websocket-version'];

    if (secWebSocketVersion !== '13') {
        socket.write('HTTP/1.1 400 Bad Request\r\n');
        socket.write('Connection: close\r\n');
        socket.end();
        return;
    }

    // Send the WebSocket handshake response
    socket.write('HTTP/1.1 101 Switching Protocols\r\n');
    socket.write('Upgrade: websocket\r\n');
    socket.write('Connection: Upgrade\r\n');
    socket.write(`Sec-WebSocket-Accept: ${secWebSocketAccept}\r\n`);
    socket.write('\r\n');

    // Handle WebSocket data
    socket.on('data', (buffer) => {
        const message = parseWebSocketMessage(buffer);
        if (message) {
            console.log('Received message:', message);
            const response = createWebSocketMessage(`Server received: ${message}`);
            socket.write(response);
        }
    });

    // Handle client disconnection
    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
});

// Function to parse WebSocket messages
function parseWebSocketMessage(buffer) {
    const firstByte = buffer.readUInt8(0);
    const opCode = firstByte & 0x0f;

    if (opCode === 0x8) {
        return null; // Handle close frame
    }

    const secondByte = buffer.readUInt8(1);
    const isMasked = secondByte & 0x80;
    const payloadLength = secondByte & 0x7f;

    let maskingKey, data;
    if (isMasked) {
        maskingKey = buffer.slice(2, 6);
        data = buffer.slice(6, 6 + payloadLength);
        for (let i = 0; i < data.length; i++) {
            data[i] ^= maskingKey[i % 4];
        }
    } else {
        data = buffer.slice(2, 2 + payloadLength);
    }

    return data.toString();
}

// Function to create WebSocket messages
function createWebSocketMessage(data) {
    const dataBuffer = Buffer.from(data);
    const payloadLength = dataBuffer.length;
    const responseBuffer = Buffer.alloc(2 + payloadLength);

    responseBuffer.writeUInt8(0x81, 0); // Set FIN and text frame opcode
    responseBuffer.writeUInt8(payloadLength, 1); // Set payload length

    dataBuffer.copy(responseBuffer, 2);

    return responseBuffer;
}
