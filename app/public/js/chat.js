var socket = io("/chat");
var author = $("#author").text();

function renderMessage(message) {
    $(".messages").append("<div class='message'><strong>" + message.author + "</strong>: " + message.message + "</div>")
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
});
socket.on('counter', function (data) {
    $(".online").html(`Online: <span class="badge badge-pill badge-success">${data.count}</span>`);
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
    $.backstretch("https://i2.wp.com/personalmarketingdigital.com.br/wp-content/uploads/2018/05/background-whatsapp-7.jpg?ssl=1")
});