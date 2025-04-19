document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-content');

    if (!container) {
        console.error('product-content element not found!');
        return;
    }
    
    if (!productId) {
        container.innerHTML = '<p class="error">No product specified</p>';
        return;
    }

    // Initialize favorites
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    fetch('./json/product.json')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) throw new Error('Product not found');

            // Favorite button HTML
            const isFavorited = favorites.some(f => f.id == productId);
            const favoriteButton = `
                <button class="favorite-btn" onclick="toggleFavorite(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
                    ${isFavorited ? '❤️' : '🖤'}
                </button>
            `;

            // Build stock status HTML
            const stockStatus = product.stock > 0 
                ? `<p class="in-stock">In Stock (${product.stock} available)</p>` 
                : `<p class="out-of-stock">Out of Stock</p>`;

            // Build cart controls HTML
            const cartControls = product.stock > 0
                ? `<div class="cart-controls">
                    <label>Quantity:</label>
                    <input type="number" id="quantity" 
                           min="1" 
                           max="${product.stock}" 
                           value="1">
                    <button class="add-to-cart">Add to Cart</button>
                   </div>`
                : '<p class="out-of-stock">Temporarily Unavailable</p>';

            container.innerHTML = `
                <div class="product-header">
                    ${favoriteButton}
                    <h1>${product.name}</h1>
                </div>
                <div class="product-images">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    ${stockStatus}
                    <p class="price">$${product.price?.toFixed(2) || 'N/A'}</p>
                    ${product.description ? `<p class="description">${product.description}</p>` : ''}
                    ${cartControls}
                    <div class="specs">
                        <h4>Specifications:</h4>
                        <table>
                            ${Object.entries(product.specs).map(([key, value]) => `
                                <tr>
                                    <td>${key.replace(/_/g, ' ')}:</td>
                                    <td>${value}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                </div>
            `;
            const addToCartBtn = container.querySelector('.add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    const quantity = parseInt(document.getElementById('quantity').value);
                    if (quantity > 0) {
                        addToCart(product.id, quantity);
                        updateCartUI();
                    }
                });
            }

            document.title = `${product.name} - DaGamePlug`;
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `<p class="error">${error.message}</p>`;
        });

    // Favorite toggle function
    window.toggleFavorite = function(id, name, price, image) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const existingIndex = favorites.findIndex(f => f.id == id);

        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
            alert('Removed from favorites!');
        } else {
            favorites.push({
                id: id,
                name: name,
                price: price,
                image: image
            });
            alert('Added to favorites!');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Update button appearance
        const favButton = document.querySelector('.favorite-btn');
        if (favButton) {
            favButton.innerHTML = existingIndex > -1 ? '🖤' : '❤️';
        }
    };
});