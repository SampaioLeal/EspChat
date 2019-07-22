const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));


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