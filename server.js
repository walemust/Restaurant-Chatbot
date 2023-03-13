const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
//const formatMessage = require('./utils/messages');
//const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const quickFoods = {
    2: 'Item1',
    3: 'Item2',
    4: 'Item3',
    5: 'Item4',
};
const orderHistory = [];

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
})
);

io.use(sharedSession(session, {
    autoSave: true,
})
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "./index.html");
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.emit("bot-message", "Hello! What is your name?");

    socket.on("user-message", (message) => {
        console.log("User message received:", message);
        const session = socket.handshake.session;

        if (!session.userName) {
            session.userName = message;
            socket.emit(
                "bot-message",
                `Welcome to the ChatBot, ${session.userName}! Place an order\n1. Type here\n99. Typehere\n98. Typehere\n97. Typehere\n0. Cancel order`
            );
        } else {
            switch (message) {
                case "1":
                    const itemOptions = Object.keys(quickFoods)
                        .map((key) => `${key}. ${quickFoods[key]}`)
                        .join("\n");
                    socket.emit(
                        "bot-message",
                        `Here is a list of items you can order:\n ${itemOptions} \nPlease select one by typing its number.`
                    );
                    break;

                case "2":
                case "3":
                case "4":
                case "5":
                    const selectedIndex = parseInt(message);
                    if (quickFoods.hasOwnProperty(selectedIndex)) {
                        const selectedItem = quickFoods[selectedIndex];
                        session.currentOrder = session.currentOrder || [];
                        session.currentOrder.push(selectedItem);
                        socket.emit(
                            "bot-message",
                            `${selectedItem} has been added to your order. Do you want to add more fast foods to your order? Type numbers. If not, type 99 to checkout.`
                        );
                    } else {
                        socket.emit("bot-message", "Invalid selection.");
                    }
                    break;

                case "99":
                    if (!session.currentOrder || session.currentOrder.length === 0) {
                        socket.emit(
                            "bot-message",
                            "No order to place. Place an order\n1. See menu"
                        );
                    } else {
                        orderHistory.push(session.currentOrder);
                        socket.emit("bot-message", "Order placed");
                        delete session.currentOrder;
                    }
                    break;

                case "98":
                    if (orderHistory.length === 0) {
                        socket.emit("bot-message", "No previous orders");
                    } else {
                        const orderHistoryString = orderHistory
                            .map((order, index) => `Order ${index + 1}: ${order.join(", ")}`)
                            .join("\n");
                        socket.emit(
                            "bot-message",
                            `Here is your order history:\n ${orderHistoryString}`
                        );
                    }
                    break;

                case "97":
                    if (!session.currentOrder || session.currentOrder.length === 0) {
                        socket.emit(
                            "bot-message",
                            "No current order. Place an order\n1. See menu"
                        );
                    } else {
                        const currentOrderString = session.currentOrder.join(", ");
                        socket.emit(
                            "bot-message",
                            `Here is your current order:\n ${currentOrderString}`
                        );
                    }
                    break;

                case "0":
                    if (session.currentOrder && session.currentOrder.length > 0) {
                        delete session.currentOrder;
                        socket.emit("bot-message", "Order cancelled");
                    } else {
                        socket.emit("bot-message", "No current order to cancel");
                    }
                    break;

                default:
                    socket.emit("bot-message", "Invalid selection.");
                    break;
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});

// const botName = 'Restaurant Bot';

// //Run when client connects
// io.on('connect', socket => {
//     socket.on('joinRoom', ({ username, room }) => {
//         const user = userJoin(socket.id, username, room);

//         socket.join(user.room);

//         //Welcome current customer
//         socket.emit('message', formatMessage(botName, 'Welcome to the RestaurantOrderBot!'));

//         //Broadcast when a customer connects
//         socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has connected`));

//         // Send users and room info
//         io.to(user.room).emit('roomUsers', {
//             room: user.room,
//             users: getRoomUsers(user.room)
//         })
//     });


//     //Listen for chatMessage
//     socket.on('chatMessage', msg => {
//         const user = getCurrentUser(socket.id);

//         io.to(user.room).emit('message', formatMessage(user.username, msg));
//     });

//     //Runs when client disconnects
//     socket.on('disconnect', () => {
//         const user = userLeave(socket.id)

//         if (user) {
//             io.to(user.room).emit('message', formatMessage(botName, `${user.username} has disconnected`));

//             // Send users and room info
//             io.to(user.room).emit('roomUsers', {
//                 room: user.room,
//                 users: getRoomUsers(user.room)
//             })
//         };

//     });
// })

// const PORT = 3000 || process.env.PORT;

// server.listen(PORT, () => {
//     console.log(`listening on http://localhost:${PORT}`)
// });