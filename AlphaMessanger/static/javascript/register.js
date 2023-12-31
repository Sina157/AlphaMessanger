var btn = document.querySelector('button[type="submit"]');
var username = document.querySelector('input[placeholder="Username"]');
var password = document.querySelector('input[placeholder="Password"]');
var email = document.querySelector('input[placeholder="Email"]');
btn.addEventListener("mousedown", CheckInputs);
function CheckInputs() {
    if (username.value.length < 3) {
        username.style.borderBottom = "1px solid red";
    }
    else {
        username.style.borderBottom = "1px solid skyblue";
    }
    if (password.value.length < 6) {
        password.style.borderBottom = "1px solid red";
    }
    else {
        password.style.borderBottom = "1px solid skyblue";
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
        email.style.borderBottom = "1px solid skyblue";
    }
    else {
        email.style.borderBottom = "1px solid red";
    }
}
//hovers
username.addEventListener("focus", function () {
    if (username.style.borderBottom == "1px solid skyblue")
        username.style.borderBottom = "2px solid rgb(99, 197, 236)";
    else if (username.style.borderBottom == "1px solid red")
        username.style.borderBottom = "2px solid red";
});
username.addEventListener("focusout", function () {
    if (username.value.length < 3)
        username.style.borderBottom = "1px solid red";
    else
        username.style.borderBottom = "1px solid skyblue";
});

email.addEventListener("focus", function () {
    if (email.style.borderBottom == "1px solid skyblue")
        email.style.borderBottom = "2px solid rgb(99, 197, 236)";
    else if (email.style.borderBottom == "1px solid red")
        email.style.borderBottom = "2px solid red";
});
email.addEventListener("focusout", function () {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))
        email.style.borderBottom = "1px solid skyblue";
    else
        email.style.borderBottom = "1px solid red";
});
password.addEventListener("focus", function () {
    if (password.style.borderBottom == "1px solid skyblue")
        password.style.borderBottom = "2px solid rgb(99, 197, 236)";
    else if (password.style.borderBottom == "1px solid red")
        password.style.borderBottom = "2px solid red";
});
password.addEventListener("focusout", function () {
    if (password.value.length < 6)
        password.style.borderBottom = "1px solid red";
    else
        password.style.borderBottom = "1px solid skyblue";

    for (let index = 0; index < password.value.length; index++)
        if (password.value[index] == " ")
            password.style.borderBottom = "1px solid red";

});
if (username.value.length < 3 && username.value != "") username.style.borderBottom = "1px solid red";
if (password.value.length < 6 && password.value != "") password.style.borderBottom = "1px solid red";
if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) && email.value != "") email.style.borderBottom = "1px solid red";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
document.getElementsByTagName("form")[0].setAttribute("onsubmit", "event.preventDefault();Send_Register_Request();")
function Send_Register_Request() {
    var ajax_request = new XMLHttpRequest();
    ajax_request.open('POST', '/register_ajax', true);
    ajax_request.setRequestHeader('Content-Type', 'application/json');
    ajax_request.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
    ajax_request.onreadystatechange = function () {
        if (ajax_request.readyState === 4) {
            if (ajax_request.status == 200){
            Swal.fire('Success', "Registration was successful", 'success')
            .then(okay => {window.location.href = "/login";});
            }
            else
            Swal.fire('Error', ajax_request.responseText, 'error');

        }
    };
    var data = {
        "username": document.getElementsByName("username")[0].value,
        "password": document.getElementsByName("password")[0].value,
        "email": document.getElementsByName("email")[0].value
      };
    ajax_request.send(JSON.stringify(data));
}