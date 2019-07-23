//App variables
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

//App setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(expressLayouts)
app.use(bodyParser.urlencoded({ extended: true }))

//Routes
//HTTPS Redirect (just in case)
/* app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] != 'https') {
        res.redirect("https://" + req.headers.host + req.url)
    } else {
        next()
    }
}); */
app.get('/', (req, res) => {
    res.render('login')
})
app.post('/chat', (req, res) => {
    res.render('chat', { username: req.body.username })
})

let messages = []
let users = []

//Socket.io configuration
const lobby = io.of('/lobby')
const chat = io.of('/chat')

lobby.on("connection", socket => {
    socket.emit("validate", users)

    socket.on("disconnect", function () {

    })
})

chat.on("connection", socket => {

    var curUser
    //When a logged user connect to app
    socket.on("connected", data => {
        curUser = data
        users.push(data)
        online = users.length
        chat.emit('counter', online)
        lobby.emit("validate", users)
        socket.emit('welcome', {user: data, messages: messages})
        socket.broadcast.emit('joined', data)
    })

    //When user send a message
    socket.on("sendMessage", data => {
        socket.broadcast.emit("receivedMessage", data)
        messages.push(data)
    })

    //When user disconnect from the app
    socket.on("disconnect", function () {
        users.pop(curUser)
        socket.emit("validate", users)
        online = users.length
        chat.emit('counter', online)
    })
})

server.listen(3000)