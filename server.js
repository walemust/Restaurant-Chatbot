const express = require("express");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const { dbConnect } = require("./db/db");


const app = express();
const server = http.createServer(app);
const io = new Server(server);
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const quickFoods = {
    2: "Burger and Fries",
    3: "Pizza",
    4: "Burritos",
    5: "Shawarma",
    6: "Meatpie",
    7: "Sausage",
    8: "Jollof-rice",
    9: "Chicken",
};

const orderHistory = [];

const sessionMiddleware = session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
});

app.use(express.static("public"));
app.use(sessionMiddleware);

app.get("/", async (req, res) => {
    try {
        res.sendFile(__dirname + "/index.html");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error serving restaurant.html");
    }
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const state = {
        userName: "",
        currentOrder: [],
    };

    const botMessage = async (message) => {
        console.log("Bot message received:", message);
        socket.emit("chat-messages", message);
    };

    const userMessage = async (message) => {
        console.log("User message received:", message);

        try {
            if (!state.userName) {
                // Save the user's name and update the welcome message
                state.userName = message;
                await botMessage(
                    `Welcome to the ChatBot, ${state.userName}!#Place an order#1. Place an order#99. Checkout order#98. Order History#97. Current order#0. Cancel order`
                );
            } else {
                switch (message) {
                    case "1":
                        // Generate the list of items dynamically
                        const itemOptions = Object.keys(quickFoods)
                            .map((key) => `${key}. ${quickFoods[key]}`)
                            .join("#");
                        await botMessage(
                            `Here is a list of items you can order:# ${itemOptions} #Please select one by typing its number.`
                        );
                        break;
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                        // Parse the number from the user input and add the corresponding item to the current order
                        const selectedIndex = parseInt(message);
                        if (quickFoods.hasOwnProperty(selectedIndex)) {
                            const selectedItem = quickFoods[selectedIndex];
                            state.currentOrder.push(selectedItem);
                            await botMessage(
                                `${selectedItem} has been added to your order. Do you want to add more items to your order? Type numbers. If not, type 99 to checkout.`
                            );
                        } else {
                            await botMessage("Invalid selection.");
                        }
                        break;
                    case "99":
                        if (state.currentOrder.length === 0) {
                            await botMessage(
                                "No order to place. Place an order#1. See menu"
                            );
                        } else {
                            orderHistory.push(state.currentOrder);
                            await botMessage("Order placed, you will get it in 30mins");
                            state.currentOrder = [];
                        }
                        break;
                    case "98":
                        if (orderHistory.length === 0) {
                            await botMessage("No previous orders");
                        } else {
                            const orderHistoryString = orderHistory
                                .map(
                                    (order, index) => `Order ${index + 1}. ${order.join(", ")}`
                                )
                                .join("#");
                            await botMessage(
                                `Here are your previous orders:#${orderHistoryString}`
                            );
                        }
                        break;
                    case "97":
                        if (state.currentOrder.length === 0) {
                            await botMessage("No current order");
                        } else {
                            const currentOrderString = state.currentOrder.join(", ");
                            await botMessage(
                                `Here is your current order:#${currentOrderString}`
                            );
                        }
                        break;
                    case "0":
                        if (state.currentOrder.length === 0) {
                            await botMessage("No order to cancel");
                        } else {
                            state.currentOrder = [];
                            await botMessage("Order canceled");
                        }
                        break;
                    default:
                        await botMessage("Invalid input");
                }
            }
        } catch (err) {
            console.log(err);
            await botMessage("An error occurred while processing your request.");
        }
    };

    socket.on("user-message", userMessage);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

dbConnect();

server.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
});