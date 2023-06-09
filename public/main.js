// //Get username from URL
const userName = document.getElementById("username");


const socket = io();

// Query DOM elements
const inputField = document.getElementById("msg");
const chatBox = document.getElementById("chat-message");


// Join chatroom
socket.emit('joinRoom', { userName });

// Helper function to append a message to the chat box
function appendMessage(message, sender) {
    const exists = document.getElementsByClassName("chat-message").length > 0
    if (!exists) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.textContent = message;

        const messageContainer = document.createElement("div");
        messageContainer.classList.add("chat-message");
        messageContainer.appendChild(messageElement);
        chatBox.appendChild(messageContainer);

    } else {
        appendMessageV2(message, sender)
    }

}

function appendMessageV2(message, sender) {
    const parent = document.getElementsByClassName("chat-message")[0]
    const child = parent.appendChild(document.createElement("div"))
    child.classList.add("message", sender)
    const timestamp = new Date().toLocaleTimeString(); // create timestamp
    const timestampElement = document.createElement("p"); // create span element for timestamp
    timestampElement.classList.add("meta");
    timestampElement.textContent = timestamp;
    child.appendChild(timestampElement)

    message.split("#").forEach(element => {
        const subchild = child.appendChild(document.createElement("p"))
        subchild.innerHTML = element
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle sending messages
function sendMessage() {
    const message = `${inputField.value.trim()}`;
    if (message === "") {
        return;
    }
    appendMessage(message, "user");
    socket.emit("user-message", message);
    inputField.value = "";
}

// Handle receiving messages from the server
socket.on("chat-messages", (message) => {
    appendMessageV2(message, "bot");
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