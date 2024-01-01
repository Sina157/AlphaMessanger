var ws, LoadedMessages = 1
var MessagesBox = document.getElementById("Messages_box")

function AddMoreMessages(data) {
    var result = ""
    data.forEach(item => {
        username = Object.entries(item)[0][0];
        message = Object.entries(item)[0][1];
        result += `
       <div class="MessageBox">
           <span>${username}</span>
           <pre class="MessageText">${message}</pre>
       </div>
       `;
    });
    document.getElementById("Messages_box").innerHTML = result
    LoadedMessages += 1;
}
MessagesBox.addEventListener('scroll', function () {
    const scrollTop = MessagesBox.scrollTop;

    if (scrollTop === 0) {
        fetch("/messages?q=" + LoadedMessages)
        .then(response => response.json())
        .then(data => AddMoreMessages(data))
        .catch(error => console.error(error));
    }

});
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
function sendMessage() {
    text = document.getElementsByTagName('textarea')[0].value;
    document.getElementsByTagName('textarea')[0].value = "";
    ws.send(`{"SendMessage": "${text}"}`);
    setTimeout(function () { MessagesBox.scrollBy(0, 10000); }, 200);
}
function connect() {
    ws = new WebSocket('ws://localhost:8080');
    ws.onopen = function () {
        ws.send(`{"Join": "${getCookie('ChatToken')}"}`);
    };

    ws.onmessage = function (e) {
        json = JSON.parse(e.data)
        var res = "<h1>Online Members</h1>";
        if (Object.entries(json)[0][0] == "<UpdateOnlineUsers>") {
            usernames = Object.entries(json)[0][1].split(',');
            usernames.forEach( item => {
                console.log(item);
                res += "<p>" + item + "</p>";
            })
            document.getElementById("OnlineUsersBox").innerHTML = res;
        } else {
            username = Object.entries(json)[0][0]
            message = Object.entries(json)[0][1]
            document.getElementById("Messages_box").innerHTML += `
            <div class="MessageBox">
                <span>${username}</span>
                <pre class="MessageText">${message}</pre>
            </div>
            `

        }

    };

    ws.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };

    ws.onerror = function (err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
}

connect();
fetch("/messages?q=" + LoadedMessages)
    .then(response => response.json())
    .then(data => AddMoreMessages(data))
    .catch(error => console.error(error));
setTimeout(() => MessagesBox.scrollBy(0, 10000), 200)