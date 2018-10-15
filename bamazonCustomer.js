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
    if (process.argv[2] === "manager") {
        managerAccess();
    }
    else {
        buyProduct();
    };
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

function managerAccess() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            choices: ["View Items for Sale", "View Low Inventory", "Add to Inventory", "Add Product"],
            message: "Please select what you would like to do."
        }
    ]).then(function (answer) {
        if (answer.options === "View Items for Sale") {
            connection.query(
                "SELECT * FROM products",
                function (err, res) {
                    if (err) throw err;
                    for (i = 0; i < res.length; i++) {
                        console.log(res[i].product_name);
                    };
                });
        }
        else if (answer.options === "View Low Inventory") {
            connection.query("SELECT * FROM products WHERE stock_quantity < 5",
                function (err, res) {
                    if (err) throw err;
                    for (i = 0; i < res.length; i++) {
                        console.log(res[i].stock_quantity + " " + res[i].product_name + " left in stock.");
                    };
                });
        }
        else if (answer.options === "Add to Inventory") {
            connection.query("SELECT * FROM products", function (err, res) {
                inquirer.prompt([
                    {
                        message: "Which product would you like to add to?",
                        type: "list",
                        choices: function () {
                            var itemArray = [];
                            for (var i = 0; i < res.length; i++) {
                                itemArray.push(res[i].product_name);
                            }
                            return itemArray;
                        },
                        name: "items"
                    }, {
                        type: "input",
                        message: "How many items would you like to add to the inventory?",
                        name: "quantity",
                    }

                ]).then(function (answer) {
                    var newStock = (parseInt(res.stock_quantity) + parseInt(answer.quantity))
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                product_name: answer.product_name
                            }
                        ]
                    )
                    console.log("You've updated " + answer.items + " by " + answer.quantity + " to bring total stock to " + newStock)
                })
            });
        }
        else if (answer.options === "Add Product") {
            inquirer.prompt([

                {
                    message: "What item would you like to add to the inventory?",
                    type: "input",
                    name: "item"
                },
                {
                    type: "input",
                    message: "How many of the item will be in stock?",
                    name: "stock"
                },
                {
                    type: "input",
                    message: "How much will the item cost?",
                    name: "price"
                },
                {
                    type: "input",
                    message: "What department will the item fall under?",
                    name: "department"
                }
            ]).then(function (answer) {
                connection.query(
                    "INSERT INTO products SET?",
                    {
                        product_name: answer.item,
                        price: answer.price,
                        stock_quantity: answer.stock,
                        department_name: answer.department

                    },
                    function (err, res) {
                    console.log("You've successfully added " + answer.item + " to the stores available items.");
                }
                )
            })
        }
    })
}


















