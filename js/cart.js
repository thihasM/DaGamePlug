// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Core cart functions
function addToCart(productId, quantity = 1) {
    fetch('./json/product.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) return;

            const existingItem = cart.find(item => item.id == productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            updateCartStorage();
        });
}

function removeOneFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id == productId);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        updateCartStorage();
        loadCart();
    }
}

function removeAllFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartStorage();
    loadCart();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        updateCartStorage();
        loadCart();
    }
}

function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.documentElement.classList.add('cart-initialized');
    }
}

// Cart display functions
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    let total = 0;

    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalPrice.textContent = '0.00';
        return;
    }

    fetch('./json/product.json')
        .then(response => response.json())
        .then(products => {
            cartItems.innerHTML = cart.map(item => {
                const product = products.find(p => p.id == item.id);
                if (!product) return '';
                
                const itemTotal = product.price * item.quantity;
                total += itemTotal;

                return `
                    <div class="cart-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="item-info">
                            <h4>${product.name}</h4>
                            <div class="price-info">
                                <span class="item-price">$${product.price.toFixed(2)}</span>
                                <div class="quantity-controls">
                                    <input type="number" 
                                           value="${item.quantity}" 
                                           min="1" 
                                           onchange="updateQuantity(${item.id}, this.value)">
                                    <div class="remove-options">
                                        ${item.quantity > 1 ? `
                                            <button onclick="removeOneFromCart(${item.id})" 
                                                    class="remove-btn"
                                                    title="Remove one">
                                                -1
                                            </button>
                                        ` : ''}
                                        <button onclick="removeAllFromCart(${item.id})" 
                                                class="remove-btn remove-all"
                                                title="Remove all">
                                            ${item.quantity > 1 ? 'Remove All' : 'Remove'}
                                        </button>
                                    </div>
                                </div>
                                <span class="item-total">$${itemTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            totalPrice.textContent = total.toFixed(2);
        });
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartUI();
});