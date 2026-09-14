require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const { setIO } = require("./config/socket");

const PORT = 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Make io available to controllers
setIO(io);

// Socket connection
io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);

    // Join an event-specific room
    socket.on("joinEvent", (eventId) => {

        socket.join(`event:${eventId}`);

        console.log(
            `Socket ${socket.id} joined event:${eventId}`
        );
    });

    // Disconnect
    socket.on("disconnect", () => {

        console.log(
            "Client disconnected:",
            socket.id
        );
    });
});

connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
