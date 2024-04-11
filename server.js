const net = require('net');
const fs = require('fs');

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const requestData = data.toString();
        console.log('Request Received:');
        console.log(requestData); // Print the received data

        // Get the request line
        const [requestLine, ...headers] = requestData.split('\r\n');
        console.log('Request Line:', requestLine); // Log the request line

        // Get the method, path, and protocol from the request line
        const [method, path, _] = requestLine.split(' ');
        console.log('Method:', method); // Log the HTTP method

        if (method === 'GET') {
            // Set default response
            let responseBody = '<html><body><h1>This page is broken</h1></body></html>';

            // Find the specific file
            const filePath = `.${path}`;

            const filePathIndex = './index.html';
            const filePath404 = './404.html';
            if (path === '/' && fs.existsSync(filePathIndex)) {
                responseBody = fs.readFileSync(filePathIndex, 'utf8');
            } else if (path !== '/' && fs.existsSync(filePath)) {
                responseBody = fs.readFileSync(filePath, 'utf8');
            } else if (fs.existsSync(filePath404)) {
                responseBody = fs.readFileSync(filePath404, 'utf8');
            }

            // Create http response
            const responseHeaders = [
                'HTTP/1.1 200 OK',
                'Content-Type: text/html',
                `Content-Length: ${Buffer.byteLength(responseBody)}`,
                '',
                ''
            ];
            const response = responseHeaders.join('\r\n') + responseBody;

            // Send the response
            socket.write(response);
        } else if (method === 'POST') {
            // Handle POST request
            const message = requestData.split('\r\n\r\n')[1]; // Extract message from request body
            console.log('Message received:', message);

            // Prepare the response for POST request
            const responseBody = '<html><body><h1>POST Request Received!</h1><p>Message: ' + message + '</p></body></html>';
            const responseHeaders = [
                'HTTP/1.1 200 OK',
                'Content-Type: text/html',
                `Content-Length: ${Buffer.byteLength(responseBody)}`,
                '',
                ''
            ];
            const response = responseHeaders.join('\r\n') + responseBody;

            // Send the response
            socket.write(response);
        } else {
            // Unsupported HTTP method
            console.log('Unsupported HTTP method:', method);

            // Prepare a 405 Method Not Allowed response
            const responseBody = '<html><body><h1>405 Method Not Allowed</h1></body></html>';
            const responseHeaders = [
                'HTTP/1.1 405 Method Not Allowed',
                'Content-Type: text/html',
                `Content-Length: ${Buffer.byteLength(responseBody)}`,
                '',
                ''
            ];
            const response = responseHeaders.join('\r\n') + responseBody;

            // Send the response
            socket.write(response);
        }

        socket.end();
    });
});

server.listen(80, () => {
    console.log('Server is listening on port 80...');
});