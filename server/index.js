const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Replace with the actual origin of your React app
        methods: ["GET", "POST"],
    },
});

const PORT = 3000;

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

io.on("connection", (socket) => {
    console.log("A user connected");

    // Example: Listen for 'message' event from the client
    socket.on("message", (data) => {
        console.log("Message from client:", data);

        // Example: Broadcast the received message to all connected clients
        io.emit("message", `Server says: ${data}`);
    });

    // You can define more socket events and logic here

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
