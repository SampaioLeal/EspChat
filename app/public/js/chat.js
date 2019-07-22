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
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    $(".messages").append(
        '<div class="ui feed">' +
        '<div class="event">' +
        '<div class="label">' +
        '<i class="pencil icon"></i>' +
        '</div>' +
        '<div class="content">' +
        '<div class="summary">' +
        data +
        ' acaba de entrar no servidor!' +
        '<div class="date">às ' +
        time +
        ' de ' +
        date +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
}

socket.emit("connected", author);

socket.on("receivedMessage", function (message) {
    renderMessage(message);
    $("#audio").trigger('play');
});
socket.on("previousMessages", function (messages) {
    for (message of messages) {
        renderMessage(message);
    }
    $("#loader").fadeOut(1000);
});
socket.on('counter', function (data) {
    $(".online").html(data.count);
});

$("#chat").submit(function (event) {
    event.preventDefault();
    var message = $("input[name=message]").val();

    if (message.length) {
        var today = new Date();
        var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();

        var messageObject = {
            author: author,
            message: message,
            date: date,
            time: time
        };
        renderMessage(messageObject);
        socket.emit("sendMessage", messageObject);
        $("input[name=message]").val("");
    }
});

socket.on('joinEvent', function (data) {
    renderEvent(data);
    console.log(data);
});

$(document).ready(function () {
    $(function () { $('.messages').scrollTop($('.messages')[0].scrollHeight); });
});