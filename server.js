const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
    res.render("index.html");
});

let messages = [];
let online = 0;

io.on("connection", socket => {
    socket.emit('previousMessages', messages);
    online++;

    socket.emit('online', { online: online });

    socket.on("sendMessage", data => {
        socket.broadcast.emit("receivedMessage", data);
        messages.push(data);
    });
    socket.on("disconnect", function () {
        count--;
        socket.emit('online', { online: online });
    });
});

server.listen(3000);