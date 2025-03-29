document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Verify critical elements exist first
    const container = document.getElementById('product-content');
    if (!container) {
        console.error('product-content element not found!');
        return;
    }

    if (!productId) {
        container.innerHTML = '<p class="error">No product specified</p>';
        return;
    }

    fetch('./json/product.json')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) throw new Error('Product not found');

            // DOM update with null checks
            container.innerHTML = `
    <div class="product-images">
        <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-info">
        <h1>${product.name}</h1>
        <p class="price">$${product.price?.toFixed(2) || 'N/A'}</p>
                ${product.description ? `<p class="description">${product.description}</p>` : ''}
        <div class="availability">
            <p class="availability-status">${product.availability ? 'In Stock' : 'Out of Stock'}</p>
        <div class="specs">
            <h4>Specifications:</h4>
            <ul>
                ${Object.entries(product.specs).map(([key, value]) => `
                    <li><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>
                `).join('')}
            </ul>
        </div>
    </div>
`;
            
            document.title = `${product.name} - DaGamePlug`;
        })
        .catch(error => {
            console.error('Error:', error);
            if (container) {
                container.innerHTML = `<p class="error">${error.message}</p>`;
            }
        });
});