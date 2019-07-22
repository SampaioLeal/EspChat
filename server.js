//App fundamentals
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Database initializing
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'mysql669.umbler.com',
    user: 'sampl',
    password: '#espchat#',
    database: 'espchat'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
    res.render("index.html");
});

//Project vars
var online = 0;
var messages = [];

//Functions
function getMessages() {
    connection.query("SELECT * FROM messages", function (err, result) {
        if (err) throw err;
        messages = result;
    });
}

io.on("connection", socket => {
    //When user connects
    getMessages();
    socket.emit('previousMessages', messages);
    online++;
    io.emit('counter', { count: online });

    //When user send a message
    socket.on("sendMessage", data => {
        socket.broadcast.emit("receivedMessage", data);
        connection.query(`INSERT INTO messages (user, message, created_at) VALUES (${data.user}, ${data.message}, NOW())`, function (err, result) {
            if (err) throw err;
            getMessages();
        });
    });
    //When user disconnect
    socket.on("disconnect", function () {
        online--;
        io.emit('counter', { count: online });
    });
});

server.listen(3000);