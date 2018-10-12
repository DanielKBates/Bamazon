CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL(5,2) NOT NULL,
stock_quantity INT(4) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
Values
("Jacket", "Clothing", 39.99, 200),
("Watch", "Jewelry", 199.99, 10),
("Shirts", "Clothing", 14.99, 500),
("Plates", "Kitchen-ware", 19.99, 100),
("Bath Towels", "Bathroom Accesories", 24.99, 50),
("Art Print", "Household Accesories", 249.99, 2),
("Chair", "Household Accesories", 99.99, 4),
("Hand Towel", "Bathroom Accesories", 9.99, 50),
("Necklace", "Jewelry", 299.99, 1),
("Food Proccesor", "Kicthen-ware", 299.99, 2);
