//cart and favorites from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Add 
function addToCart(productId, quantity = 1) {
    fetch('./json/product.json')
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) return;

            const existingItem = cart.find(item => item.id == productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity });
            }
            saveCart();
            alert('Item added to cart successfully!');
        });
}

// Remove 
function removeAllFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    loadCart();
}

// quantity 
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
        loadCart();
    }
}

// Save cart 
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = document.getElementById('cart-count');
    if (count) {
        count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.documentElement.classList.add('cart-initialized');
    }
}

// dis cart 
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (!cartItems || !totalPrice) return;
    let total = 0;
    cartItems.innerHTML = '';

    if (cart.length === 0 && checkoutBtn) {
        checkoutBtn.onclick = e => {
            e.preventDefault();
            alert('Your cart is empty!');
        };
        checkoutBtn.classList.add('disabled');
    }

    fetch('./json/product.json')
        .then(res => res.json())
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
                                <span>$${product.price.toFixed(2)}</span>
                                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                                <button onclick="removeAllFromCart(${item.id})">${item.quantity > 1 ? 'Remove All' : 'Remove'}</button>
                                <span>Total: $${itemTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            totalPrice.textContent = total.toFixed(2);
        });
}

// Favorite 
function toggleFavorite(productId, productName, productPrice, productImage) {
    const index = favorites.findIndex(f => f.id == productId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ id: productId, name: productName.replace(/'/g, "\\'"), price: productPrice, image: productImage });
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(productId);
}

function updateFavoriteButton(productId) {
    document.querySelectorAll(`.favorite-btn[data-product-id="${productId}"]`).forEach(btn => {
        btn.innerHTML = favorites.some(f => f.id == productId) ? '❤️' : '🖤';
    });
}

function loadFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;
    container.innerHTML = favorites.length ? favorites.map(product => `
        <div class="favorite-item">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="favorite-btn" data-product-id="${product.id}" onclick="toggleFavorite(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
                ${favorites.some(f => f.id == product.id) ? '❤️ Remove' : '🖤 Add'}
            </button>
        </div>`).join('') : '<p>No favorite items saved yet</p>';
}

// Initi
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const id = btn.dataset.productId;
        btn.innerHTML = favorites.some(f => f.id == id) ? '❤️' : '🖤';
    });
    if (document.getElementById('favorites-container')) loadFavorites();
});

// glob access
window.CartManager = {
    addToCart,
    removeAllFromCart,
    updateQuantity,
    loadCart,
    clearCart: () => { cart = []; saveCart(); loadCart(); }
};
