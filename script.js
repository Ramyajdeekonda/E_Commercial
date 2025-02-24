// Sample menu items data
const menuItems = [
    {
        id: 1,
        name: "Classic Burger",
        price: 12.99,
        image: "burger.jpg",
        description: "Juicy beef patty with fresh vegetables"
    },
    {
        id: 2,
        name: "Margherita Pizza",
        price: 14.99,
        image: "margherita_1.jpg",
        description: "Traditional Italian pizza with tomatoes and mozzarella"
    },
    {
        id: 3,
        name: "Caesar Salad",
        price: 9.99,
        image: "salad.jpg",
        description: "Fresh romaine lettuce with Caesar dressing"
    },
    // Add more menu items as needed
];

// Shopping cart
let cart = [];

// Function to display menu items
function displayMenuItems() {
    const menuContainer = document.getElementById('menu-items');
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">$${item.price.toFixed(2)}</p>
                <button onclick="addToCart(${item.id})" class="cta-button">Add to Cart</button>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Function to add items to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
        // Check if item already exists in cart
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartCount();
        alert(`${item.name} added to cart!`);
    }
}

// Function to update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

// Function to update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;
    
    cartItemsDiv.innerHTML = cart.map(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        return `
            <div class="cart-item">
                <span>${item.name} x${item.quantity || 1}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toFixed(2);
}

// Function to show cart page
function showCartPage() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('hero').style.display = 'none';
    const cartPage = document.getElementById('cart-page');
    cartPage.style.display = 'block';
    
    updateCartPageDisplay();
}

// Function to update cart page display
function updateCartPageDisplay() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartPageTotal = document.getElementById('cart-page-total');
    let total = 0;
    
    cartItemsList.innerHTML = cart.map(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} x ${item.quantity || 1}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(${item.id}, ${(item.quantity || 1) - 1})">-</button>
                    <span>${item.quantity || 1}</span>
                    <button onclick="updateQuantity(${item.id}, ${(item.quantity || 1) + 1})">+</button>
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    cartPageTotal.textContent = total.toFixed(2);
}

// Function to update quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
        updateCartPageDisplay();
    }
}

// Function to remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    updateCartPageDisplay();
}

// Function to show payment modal with selected method
function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    const closeBtn = document.querySelector('.close');
    const confirmBtn = document.getElementById('confirm-payment');
    const paymentBtns = document.querySelectorAll('.payment-btn');
    const paymentDetails = document.getElementById('payment-details');
    
    updateCartDisplay();
    modal.style.display = 'block';
    
    // Handle payment method selection
    paymentBtns.forEach(btn => {
        btn.onclick = function() {
            paymentBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            // Show relevant payment details form
            const method = btn.dataset.method;
            showPaymentDetails(method, paymentDetails);
        }
    });
    
    // Close modal handlers
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
    }
    
    // Handle payment confirmation
    confirmBtn.onclick = function() {
        const selectedMethod = document.querySelector('.payment-btn.selected');
        if (!selectedMethod) {
            alert('Please select a payment method!');
            return;
        }
        
        const method = selectedMethod.dataset.method;
        processPayment(method);
    }
}

// Function to show payment details based on method
function showPaymentDetails(method, container) {
    let html = '';
    switch(method) {
        case 'upi':
            html = `
                <div class="payment-form">
                    <h3>UPI Payment</h3>
                    <input type="text" placeholder="Enter UPI ID" required>
                </div>
            `;
            break;
        case 'credit':
        case 'debit':
            html = `
                <div class="payment-form">
                    <h3>${method === 'credit' ? 'Credit' : 'Debit'} Card Details</h3>
                    <input type="text" placeholder="Card Number" required>
                    <div class="card-details">
                        <input type="text" placeholder="MM/YY" required>
                        <input type="text" placeholder="CVV" required>
                    </div>
                    <input type="text" placeholder="Card Holder Name" required>
                </div>
            `;
            break;
        case 'netbanking':
            html = `
                <div class="payment-form">
                    <h3>Net Banking</h3>
                    <select required>
                        <option value="">Select Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                    </select>
                </div>
            `;
            break;
        case 'cash':
            html = `
                <div class="payment-form">
                    <h3>Cash on Delivery</h3>
                    <p>Pay with cash upon delivery.</p>
                </div>
            `;
            break;
    }
    container.innerHTML = html;
}

// Function to process payment
function processPayment(method) {
    // Here you would typically integrate with a payment gateway
    alert(`Processing payment via ${method}...\nTotal: $${document.getElementById('cart-total').textContent}`);
    
    // Clear cart after successful payment
    cart = [];
    updateCartCount();
    
    // Close modal
    document.getElementById('payment-modal').style.display = 'none';
}

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
    displayMenuItems();
    
    // Add cart icon click handler
    document.querySelector('a[href="#cart"]').addEventListener('click', (e) => {
        e.preventDefault();
        showCartPage();
    });
    
    // Add checkout button handler
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        showPaymentModal();
    });
}); 