var socket = io("/lobby");
var userList;
socket.on("validate", function (users) {
    userList = users;
});

function post(path, params, method = 'post') {
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

$("#join").click(function (event) {
    if ($("#name").val().length) {
        event.preventDefault();
        var validate = false;
        for (user of userList) {
            if (user == $("#name").val()) {
                validate = true;
                break;
            }
        }
        if (validate) {
            $("#name").val("");
            toastr.error('Este usuário já está online!', 'Desculpe.');
        }
        else {
            post('/chat', { username: $("#name").val() });
        }
    }
    else {
        toastr.error('Você deve inserir um nome de usuário!', 'Fique atento!');
    }
});
$("#name").keypress(function (event) {
    if (event.which == 13) {
        if ($("#name").val().length) {
            event.preventDefault();
            var validate = false;
            for (user of userList) {
                if (user == $("#name").val()) {
                    validate = true;
                    break;
                }
            }
            if (validate) {
                $("#name").val("");
                toastr.error('Este usuário já está online!', 'Desculpe.');
            }
            else {
                post('/chat', { username: $("#name").val() });
            }
        }
        else {
            toastr.error('Você deve inserir um nome de usuário!', 'Fique atento!');
        }
    }
});

$(document).ready(function () {
    $.backstretch("https://i2.wp.com/personalmarketingdigital.com.br/wp-content/uploads/2018/05/background-whatsapp-7.jpg?ssl=1")
});