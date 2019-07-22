var socket = io("/chat");
var author = $("#author").text();

function renderMessage(message) {
    $(".messages").append("<div class='item'>" +
        "<div class='content'>" +
        "<div class='header'><strong>" +
        message.author +
        "</strong>:</div> " +
        "<div class='description'>" +
        message.message +
        "</div></div></div>");
    $(function () { $('.messages').scrollTop($('.messages')[0].scrollHeight); });
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
        var messageObject = {
            author: author,
            message: message
        };
        renderMessage(messageObject);
        socket.emit("sendMessage", messageObject);
        $("input[name=message]").val("");
    }
});
$(document).ready(function () {
    $(function () { $('.messages').scrollTop($('.messages')[0].scrollHeight); });
});