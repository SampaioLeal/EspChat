const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts)          // Definimos que vamos utilizar o express-ejs-layouts na nossa aplicação
app.use(bodyParser.urlencoded())
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index');
})

let messages = [];
var online = 0;

io.on("connection", socket => {
    socket.emit('previousMessages', messages);

    online++;
    io.emit('counter', { count: online });

    socket.on("sendMessage", data => {
        socket.broadcast.emit("receivedMessage", data);
        messages.push(data);
    });
    socket.on("disconnect", function () {
        online--;
        io.emit('counter', { count: online });
    });
});

server.listen(3000);