let inventoryData = {
    "Pencil": { quantity: 20, minimum: 10 },
    "Paper": { quantity: 50, minimum: 20 },
    "Marker": { quantity: 30, minimum: 15 },
    "Stapler": { quantity: 10, minimum: 5 },
    "USB Drive": { quantity: 15, minimum: 5 },
    "Mouse": { quantity: 8, minimum: 3 },
    "Keyboard": { quantity: 5, minimum: 2 }
};

let currentUser = '';
let transactionHistory = [];

function startSession() {
    const nameInput = document.getElementById('userName');
    if (nameInput.value.trim() === '') {
        alert('Please enter your name');
        return;
    }
    currentUser = nameInput.value;
    showMainMenu();
}

function showMainMenu() {
    let html = `
        <div class="screen" id="mainMenu">
            <div class="box-buddy small">
                <div class="speech-bubble">What would you like to do, ${currentUser}?</div>
                <div class="box-body">
                    <div class="box-lid"></div>
                    <div class="box-face">
                        <div class="box-eye left"></div>
                        <div class="box-eye right"></div>
                        <div class="box-smile"></div>
                    </div>
                </div>
            </div>
            <h2>Welcome, ${currentUser}!</h2>
            <div class="menu-grid">
                <button onclick="showInventoryDashboard()" class="menu-button">
                    <i class="fas fa-boxes"></i>View Inventory
                </button>
                <button onclick="showAddNewItem()" class="menu-button">
                    <i class="fas fa-plus-circle"></i>Add New Items
                </button>
                <button onclick="showTakeItems()" class="menu-button">
                    <i class="fas fa-minus-circle"></i>Take Items
                </button>
                <button onclick="showReturnItems()" class="menu-button">
                    <i class="fas fa-undo"></i>Return Items
                </button>
                <button onclick="showInventoryHistory()" class="menu-button">
                    <i class="fas fa-history"></i>View History
                </button>
            </div>
            <button onclick="logout()" class="back-button">Logout</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
    addMenuButtonEffects();
}

function addMenuButtonEffects() {
    const buttons = document.querySelectorAll('.menu-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
        });
    });
}


function showInventoryDashboard() {
    let html = `
        <div class="screen">
            <h2>Inventory Dashboard</h2>
            <div id="inventory-list">
                ${Object.entries(inventoryData).map(([item, data]) => `
                    <div class="item-card ${data.quantity <= data.minimum ? 'low-stock' : ''}">
                        <h3>${item}</h3>
                        <p>Current Stock: ${data.quantity}</p>
                        <p>Status: ${data.quantity <= data.minimum ? 'Low Stock' : 'Normal'}</p>
                    </div>
                `).join('')}
            </div>
            <button onclick="exportToExcel()">Export to Excel</button>
            <button onclick="showMainMenu()">Back to Main Menu</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function showAddNewItem() {
    let html = `
        <div class="screen">
            <h2>Add New Item</h2>
            <input type="text" id="newItemName" placeholder="Item Name">
            <input type="number" id="newItemQuantity" placeholder="Initial Stock">
            <input type="number" id="newItemMinimum" placeholder="Minimum Stock">
            <button onclick="addNewItem()">Add Item</button>
            <button onclick="showMainMenu()">Back to Main Menu</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function addNewItem() {
    const name = document.getElementById('newItemName').value;
    const quantity = parseInt(document.getElementById('newItemQuantity').value);
    const minimum = parseInt(document.getElementById('newItemMinimum').value);

    if (name && !isNaN(quantity) && !isNaN(minimum)) {
        inventoryData[name] = { quantity, minimum };
        transactionHistory.push({
            timestamp: new Date().toLocaleString(),
            user: currentUser,
            action: 'Added',
            item: name,
            quantity: quantity
        });
        alert('Item added successfully!');
        showMainMenu();
    } else {
        alert('Please fill all fields correctly.');
    }
}

function showTakeItems() {
    let html = `
        <div class="screen">
            <h2>Take Items</h2>
            ${Object.entries(inventoryData).map(([item, data]) => `
                <div class="item-card">
                    <h3>${item}</h3>
                    <p>Current Stock: ${data.quantity}</p>
                    <input type="number" id="take-${item}" min="1" max="${data.quantity}" value="1">
                    <button onclick="takeItem('${item}')">Take</button>
                </div>
            `).join('')}
            <button onclick="showMainMenu()">Back to Main Menu</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function takeItem(item) {
    const quantity = parseInt(document.getElementById(`take-${item}`).value);
    if (quantity > 0 && quantity <= inventoryData[item].quantity) {
        inventoryData[item].quantity -= quantity;
        transactionHistory.push({
            timestamp: new Date().toLocaleString(),
            user: currentUser,
            action: 'Took',
            item: item,
            quantity: quantity
        });
        showTakeItems();
    } else {
        alert('Invalid quantity');
    }
}

function showReturnItems() {
    let html = `
        <div class="screen">
            <h2>Return Items</h2>
            ${Object.entries(inventoryData).map(([item, data]) => `
                <div class="item-card">
                    <h3>${item}</h3>
                    <p>Current Stock: ${data.quantity}</p>
                    <input type="number" id="return-${item}" min="1" value="1">
                    <button onclick="returnItem('${item}')">Return</button>
                </div>
            `).join('')}
            <button onclick="showMainMenu()">Back to Main Menu</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function returnItem(item) {
    const quantity = parseInt(document.getElementById(`return-${item}`).value);
    if (quantity > 0) {
        inventoryData[item].quantity += quantity;
        transactionHistory.push({
            timestamp: new Date().toLocaleString(),
            user: currentUser,
            action: 'Returned',
            item: item,
            quantity: quantity
        });
        showReturnItems();
    } else {
        alert('Invalid quantity');
    }
}

function showInventoryHistory() {
    let html = `
        <div class="screen">
            <h2>Inventory History</h2>
            ${transactionHistory.map(transaction => `
                <div class="history-item">
                    <p>${transaction.timestamp} - ${transaction.user} ${transaction.action} ${transaction.quantity} ${transaction.item}(s)</p>
                </div>
            `).join('')}
            <button onclick="showMainMenu()">Back to Main Menu</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function exportToExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Item,Current Stock,Minimum Stock,Status\n";
    
    for (let [item, data] of Object.entries(inventoryData)) {
        let status = data.quantity <= data.minimum ? "Low Stock" : "Normal";
        let row = `${item},${data.quantity},${data.minimum},${status}`;
        csvContent += row + "\n";
    }
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
}
function rotateMessages() {
    const speechBubble = document.querySelector('.speech-bubble');
    const messages = [
        "Hi! I'm StockBuddy! 📦",
        "Let's organize together! ✨",
        "Ready to help you! 😊",
        "Keeping track is fun! 🎉"
    ];
    let currentIndex = 0;

    setInterval(() => {
        speechBubble.textContent = messages[currentIndex];
        currentIndex = (currentIndex + 1) % messages.length;
    }, 5000); // Change message every 5 seconds
}
function logout() {
    currentUser = '';
    document.getElementById('app').innerHTML = `
        <div class="screen" id="loginScreen">
            <div class="box-buddy">
                <div class="speech-bubble">Hi! I'm StockBuddy! 📦</div>
                <div class="box-body">
                    <div class="box-lid"></div>
                    <div class="box-face">
                        <div class="box-eye left"></div>
                        <div class="box-eye right"></div>
                        <div class="box-smile"></div>
                    </div>
                </div>
            </div>
            <h1>StockBuddy</h1>
            <h2>Office Supply Inventory Management</h2>
            <input type="text" id="userName" placeholder="Enter your name">
            <button onclick="startSession()">START SESSION</button>
        </div>
    `;
    
    // Add these lines at the end of the logout function
    rotateMessages();
    setupBoxBuddyReaction();
}
function rotateMessages() {
    const speechBubble = document.querySelector('.speech-bubble');
    const messages = [
        "Hi! I'm StockBuddy! 📦",
        "Let's organize together! ✨",
        "Ready to help you! 😊",
        "Keeping track is fun! 🎉"
    ];
    let currentIndex = 0;

    setInterval(() => {
        speechBubble.textContent = messages[currentIndex];
        currentIndex = (currentIndex + 1) % messages.length;
    }, 5000); // Change message every 5 seconds
}

function setupBoxBuddyReaction() {
    const nameInput = document.getElementById('userName');
    const speechBubble = document.querySelector('.speech-bubble');
    const boxBuddy = document.querySelector('.box-buddy');

    nameInput.addEventListener('input', () => {
        if (nameInput.value.length > 0) {
            speechBubble.textContent = `Nice to meet you, ${nameInput.value}! 👋`;
            boxBuddy.style.transform = 'scale(1.1)';
        } else {
            speechBubble.textContent = "What's your name? 😊";
            boxBuddy.style.transform = 'scale(1)';
        }
    });
}


// Add to app.js
function addBoxBuddyInteraction() {
    const boxBuddy = document.querySelector('.box-buddy');
    const speechBubble = document.querySelector('.speech-bubble');
    
    boxBuddy.addEventListener('mouseover', () => {
        speechBubble.textContent = "Hello there!";
        speechBubble.style.opacity = 1;
    });
    
    boxBuddy.addEventListener('mouseout', () => {
        speechBubble.style.opacity = 0;
    });
}


// Initialize the app
logout();
