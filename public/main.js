// const chatForm = document.getElementById('chat-form');
// const chatMessages = document.querySelector('.chat-messages');
// const roomName = document.getElementById('room-name');
// const userList = document.getElementById('users');

// //Get username and room from URL
// const { username, room } = Qs.parse(location.search, {
//     ignoreQueryPrefix: true
// });

// console.log(username, room);

const socket = io();

// Query DOM elements
const inputField = document.getElementById("msg");
const chatBox = document.getElementById("chat-message");
console.log(chatBox);

// Helper function to append a message to the chat box
function appendMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message-text", sender);
    messageElement.textContent = message;

    const timestamp = new Date().toLocaleTimeString(); // create timestamp
    const timestampElement = document.createElement("span"); // create span element for timestamp
    timestampElement.classList.add("timestamp");
    timestampElement.textContent = timestamp;

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timestampElement);
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle sending messages
function sendMessage() {
    const message = inputField.value.trim();
    if (message === "") {
        return;
    }
    appendMessage(message, "user");
    socket.emit("user-message", message);
    inputField.value = "";
}

// Handle receiving messages from the server
socket.on("bot-message", (message) => {
    appendMessage(message, "bot");
});

// Attach event listeners
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
});

document.querySelector(".btn").addEventListener("click", sendMessage);

document.getElementById("msg").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// // Join chatroom
// socket.emit('joinRoom', { username, room });

// // Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//     outputRoomName(room);
//     outputUsers(users);
// })

// //Mesage from server
// socket.on('message', message => {
//     console.log(message);
//     outputMessage(message);

//     // Scroll down
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// //Message submit
// chatForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     //Get message text
//     const msg = e.target.elements.msg.value;

//     //Emit message to server
//     socket.emit('chatMessage', msg);


//     // Clear input
//     e.target.elements.msg.value = '';
//     e.target.elements.msg.focus();
// });

// //Output message to server
// function outputMessage(message) {
//     const div = document.createElement('div');
//     div.classList.add('message');
//     div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
//                     <p class="text">
//                         ${message.text}
//                     </p>`;
//     document.querySelector('.chat-messages').appendChild(div);
// }

// // Add room name to DOM
// function outputRoomName(room) {
//     roomName.innerText = room;
// }

// // Add users to DOM
// function outputUsers(users) {
//     userList.innerHTML = `
//     ${users.map(user => `<li>${user.username}</li>`).join('')}
//     `;
// }
