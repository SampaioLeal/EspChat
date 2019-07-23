var socket = io("/chat");
var author = $("#author").text();

function renderMessage(message) {
    $(".messages").append(
        '<div class="comment">' +
        '<a class="avatar">' +
        '<img src="/images/user.png">' +
        '</a>' +
        '<div class="content">' +
        '<a class="author">' +
        message.author +
        '</a>' +
        '<div class="metadata">' +
        '<span class="date">às ' +
        message.time +
        ' de ' +
        message.date +
        '</span>' +
        '</div>' +
        '<div class="text">' +
        message.message +
        '</div>' +
        '</div>' +
        '</div>');
    $(function () { $('.messages').scrollTop($('.messages')[0].scrollHeight); });
}
function renderEvent(data) {
    toastr.info(`${data} acaba de entrar no chat!`, 'Dê as boas vindas!');
}

socket.emit("connected", author);
console.log("Client connected!");

socket.on("receivedMessage", function (message) {
    renderMessage(message);
    $("#audio").trigger('play');
    console.log("New Event: receivedMessage");
});

$("#chat").submit(function (event) {
    event.preventDefault();
    var message = $("input[name=message]").val();

    if (message.length) {
        let today = new Date();
        let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes();

        let messageObject = {
            author: author,
            message: message,
            date: date,
            time: time
        };
        renderMessage(messageObject);
        socket.emit("sendMessage", messageObject);
        console.log("New Event: sendMessage");
        $("input[name=message]").val("");
    }
});

socket.on('counter', function (data) {
    $(".online").html(data);
    console.log("New Event: counter");
});
socket.on('joined', function (data) {
    renderEvent(data);
    console.log("New Event: joined");
});
socket.on("welcome", function (data) {
    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes();
    renderMessage({
        author: "BOT Jubileu",
        message: `Seja bem-vindo, ${data.user}!`,
        time: time,
        date: date
    });
    for (message of data.messages) {
        renderMessage(message);
    }
    $("#loader").fadeOut(1000);
    console.log("New Event: welcome");
});

$(document).ready(function () {
    $(function () { $('.messages').scrollTop($('.messages')[0].scrollHeight); });
});