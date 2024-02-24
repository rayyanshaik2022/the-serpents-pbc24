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

// Game constants
MAP_SIZE = 500

// Game classes
const Cannon = require("./game_logic/entities/cannon.js");
const Ship = require("./game_logic/entities/ship.js");
const config = require("./game_logic/config.js");

let SERVER_DATA;

const gameInit = () => {
    SERVER_DATA = {
        players : {},
        tokens : []
    }
}

gameInit()

// Game loop interval (update every second)
const gameLoopInterval = setInterval(() => {
    // Update the game state

    // Broadcast the updated game state to all connected clients
    io.emit("game_state", { counter: 1 });
}, 1000 / 60);

io.on("connection", (socket) => {
    console.log("A user connected");
    SERVER_DATA.players[socket.id] = new Ship();
    console.log(SERVER_DATA)

    // Example: Listen for 'message' event from the client
    socket.on("message", (data) => {
        console.log("Message from client:", data);
        // Example: Broadcast the received message to all connected clients
        io.emit("message", `Server says: ${data}`);
    });

    // You can define more socket events and logic here

    socket.on("disconnect", () => {
        console.log("User disconnected");
        delete SERVER_DATA.players[socket.id]
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
