const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Change if you set a password
  password: 'Gowthami@2004',      // Type your password
  database: 'chatdb'
});
db.connect((err) => { if (err) throw err; console.log('DB connected!'); });

// Serve frontend files
app.use(express.static('public'));

// Handle real-time chat
io.on('connection', (socket) => {
  // Load old messages
  db.query('SELECT * FROM messages', (err, results) => {
    if (!err) {
      results.forEach(row =>
        socket.emit('chat message', { user: row.username, message: row.message, timestamp: row.created_at })
      );
    }
  });
  // On new message from a client
  socket.on('chat message', (data) => {
    db.query('INSERT INTO messages (username, message) VALUES (?, ?)', [data.user, data.message]);
    io.emit('chat message', { ...data, timestamp: new Date() });
  });
});

// Start the server
server.listen(3000, () => console.log('Listening at http://localhost:3000'));
