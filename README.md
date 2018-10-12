# Node.js-MySQL-Store

### About the application
This virtual store utilized MySQL and Node.js to replicate a working store. Users can use Node.js to interact with a MySQL database to buy items, and will be informed if their order went through, and how much money they spent. This application uses the inquirer npm package for Node.js to recieve user input and the mysql package to communicate with the database.

### Buying Items
Via the inquirer package, this application will use Node.js to take in user input about their desired item(s).
![Item list](/assets/images/item-list.PNG)

The store only has a finite amount of each product. Buying any item for the desired quantity will reduce the amount of available items and update the database accordingly.

![quanity](/assets/images/item-quantity.PNG)

However, if the user tries to buy a quantity of any item that is larger than the available stock, the transition will be declined, and they will be redirected to the beginning of the buying process.

![declined](/assets/images/declined.PNG)