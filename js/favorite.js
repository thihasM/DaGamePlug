document.addEventListener('DOMContentLoaded', () => {
    loadFavoriteProducts();
    loadFavoriteOrders();
    document.getElementById('save-order-btn')?.addEventListener('click', saveCurrentOrderAsFavorite);
});

// Favorite Products
function loadFavoriteProducts() {
    const container = document.getElementById('favorite-products');
    if (!container) return;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        container.innerHTML = '<p class="empty">No favorite products found</p>';
        return;
    }

    container.innerHTML = favorites.map(item => `
        <div class="favorite-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='./images/fallback-image.jpg'">
            <h3>${item.name}</h3>
            <p class="price">$${(item.price || 0).toFixed(2)}</p>
            <div class="favorite-actions">
                <button onclick="CartManager.addToCart(${item.id}, 1)">Add to Cart</button>
                <button onclick="removeFavorite(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function removeFavorite(productId) {
    if (!confirm('Are you sure you want to remove this item from favorites?')) return;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => item.id != productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavoriteProducts();
}

// Favorite Orders
function loadFavoriteOrders() {
    const container = document.getElementById('favorite-order-list');
    if (!container) return;

    const orders = JSON.parse(localStorage.getItem('favoriteOrders')) || [];

    if (orders.length === 0) {
        container.innerHTML = '<p class="empty">No saved orders found</p>';
        return;
    }

    container.innerHTML = orders.map((order, index) => `
        <div class="favorite-order">
            <div class="order-header">
                <h4>Order #${index + 1}</h4>
                <small>${new Date(order.date).toLocaleDateString()}</small>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='./images/fallback-image.jpg'">
                        <span>${item.name} x${item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-actions">
                <button onclick="loadOrderToCart(${index})">Load to Cart</button>
                <button onclick="deleteFavoriteOrder(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function saveCurrentOrderAsFavorite() {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    if (currentCart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const favoriteOrders = JSON.parse(localStorage.getItem('favoriteOrders')) || [];

    favoriteOrders.push({
        date: new Date().toISOString(),
        items: currentCart
    });

    localStorage.setItem('favoriteOrders', JSON.stringify(favoriteOrders));
    loadFavoriteOrders();
    alert('Order saved to favorites!');
}

function deleteFavoriteOrder(index) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    let orders = JSON.parse(localStorage.getItem('favoriteOrders')) || [];
    orders.splice(index, 1);
    localStorage.setItem('favoriteOrders', JSON.stringify(orders));
    loadFavoriteOrders();
}

function loadOrderToCart(orderIndex) {
    if (!confirm('This will replace your current cart. Continue?')) return;

    const orders = JSON.parse(localStorage.getItem('favoriteOrders')) || [];
    const order = orders[orderIndex];

    if (order) {
        CartManager.clearCart();
        order.items.forEach(item => {
            CartManager.addToCart(item.id, item.quantity);
        });
        alert('Order loaded to cart!');
    }
}
