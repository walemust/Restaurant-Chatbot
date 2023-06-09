# Restaurant-Chatbot

Live Link: https://restaurantbot.onrender.com

# Introduction

This is a simple food restaurant chatbot that allows users to place orders through a chat interface. It is built with Node.js, Express, Socket.IO, and uses session middleware for user management.

# Installation

Clone the repository using git clone https://github.com/walemust/Restaurant-Chatbot.git
Install dependencies with "npm install"
Start the server with "npm start"
Open the application by navigating to http://localhost:3000 in your browser.

# Usage

Once the application is running, users can interact with the chatbot to place orders. The bot will first prompt the user to enter their name, and then provide them with a list of options to choose from:

1: Place an order
99: Checkout order
98: Order History
97: Current order
0: Cancel order
If the user selects "1", the bot will provide a list of menu items for the user to choose from. The user can select an item by entering its corresponding number. Once the user has selected an item, it will be added to their current order.

Users can continue to add items to their order by selecting more items from the menu. Once the user is finished adding items, they can select "99" to checkout their order. The bot will confirm that the order has been placed and save it to the order history.

Users can also view their current order by selecting "97", view their order history by selecting "98", or cancel their current order by selecting "0". If the user selects an invalid option, the bot will let them know.

# Contributing

If you would like to contribute to this project, please follow these steps:

# Fork this repository

Create a new branch (git checkout -b new-feature)
Make your changes and commit them (git commit -am "Added new feature")
Push to your branch (git push origin new-feature)
Create a pull request
Please ensure that your code follows the existing code style and includes tests where appropriate.

# License

This project is licensed under the MIT License. See the LICENSE file for details.
