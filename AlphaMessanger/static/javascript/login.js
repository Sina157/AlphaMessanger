var username = document.querySelector('input[placeholder="Username"]');
var password = document.querySelector('input[placeholder="Password"]');
var btn = document.querySelector('button[type="submit"]');
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
});
