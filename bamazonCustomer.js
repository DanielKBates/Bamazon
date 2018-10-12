var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({ 
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    buyProduct();
});

function buyProduct() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "item",
                    type: "list",
                    choices: function () {
                        var itemArray = [];
                        for (var i = 0; i < results.length; i++) {
                            itemArray.push(results[i].product_name);
                        }
                        return itemArray;
                    },
                    message: "Welcome! Please select what item would you like to buy."
                },
                {
                    type: "input",
                    message: "How many would you like to buy?",
                    name: "quantity"
                }
            ])
            .then(function (answer) {
                var userItem;
                var userQnty = parseInt(answer.quantity);

                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.item) {
                        userItem = results[i];
                    };
                };
                if (userQnty < userItem.stock_quantity) {
                    console.log("You've bought " + userQnty + " " + userItem.product_name + " for a price of $" + userQnty * userItem.price);
                    var newStock = parseInt(userItem.stock_quantity) - userQnty;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: userItem.item_id
                            }
                        ],
                    );
                        console.log("The new number of " + userItem.product_name + " in stock is " + userItem.stock_quantity)
                }
                else {
                    console.log("Sorry, we don't have enough " + userItem.product_name + " in stock for your order.");
                    buyProduct();
                }
                connection.end();
            });
    });
};









