let allProducts = [];

// get produk dari API data based on filter yang kita pilih
async function fetchProducts(brand = '', category = '') {
    let url = 'https://makeup-api.herokuapp.com/api/v1/products.json';
    const params = [];

    if (brand) {
        params.push(`brand=${brand}`);
    }
    if (category) {
        params.push(`product_type=${category}`);
    }

    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }

    console.log(`Fetching products from: ${url}`); // untuk debugging


    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const products = await response.json();
        allProducts = products; // simpan produk yang dah dapat tu kat sini


        displayProducts(allProducts); // display semua produk mula-mula

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// display produk dalam list makeup page
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        productItem.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Type:</strong> ${product.product_type}</p>
            <p><strong>Rating:</strong> ${product.rating || 'No rating available'}</p>
            <p><strong>Description:</strong> ${product.description || 'No description available'}</p>
            <button onclick="addToWishlist(${product.id}, '${product.name}', '${product.image_link}', '${product.brand}', ${product.price})">Add to Wishlist</button>
        `;
        productList.appendChild(productItem);
    });
}

// filter produk based on harga minimum and maksimum
function filterProducts() {
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    const filteredProducts = allProducts.filter(product => {
        return product.price >= minPrice && product.price <= maxPrice;
    });

    displayProducts(filteredProducts); // display produk yang already filtered
}

// save produk kat wishlist and simpan dalam local storage
function addToWishlist(id, name, image, brand, price) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // cek kalau item dah ada dalam wishlist
    if (wishlist.some(item => item.id === id)) {
        alert(`${name} is already in your wishlist.`);
        return;
    }

    wishlist.push({ id, name, image, brand, price, note: '' }); // start dengan note field tu empty dulu
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert(`${name} added to wishlist!`);
}

// display item wishlist kat wishlist page
function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlist');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    wishlistContainer.innerHTML = ''; // clear existing items

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }

    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('wishlist-item');

        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p><strong>Brand:</strong> ${item.brand}</p>
            <p><strong>Price:</strong> $${item.price}</p>
            <textarea id="note-${item.id}" placeholder="Add a note">${item.note}</textarea>
            <button class="save-note" onclick="saveNoteForItem(${item.id})">Save Note</button>
            <button class="remove-button" onclick="removeFromWishlist(${item.id})">Remove from Wishlist</button>
        `;
        wishlistContainer.appendChild(wishlistItem);
    });
}

// user save notes untuk item yang dah ada dalam wishlist page
function saveNoteForItem(id) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const noteInput = document.getElementById(`note-${id}`);
    const updatedNote = noteInput.value;

    const itemIndex = wishlist.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        wishlist[itemIndex].note = updatedNote; // update notes yang ada dalam wishlist lepas user dah enter notes tu
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Note saved successfully!');
    }
}

// remove item dari wishlist page and update local storage
function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert('Item removed from wishlist.');
    displayWishlist(); // update wishlist page tu
}

// start page ikut context
function initializePage() {
    if (document.getElementById('product-list')) {
        fetchProducts(); //  load semua produk dalam list of produk makeup

        // tambah event listener untuk button filter
        document.getElementById('filter-button').addEventListener('click', filterProducts);
    }
    if (document.getElementById('wishlist')) {
        displayWishlist(); // load wishlist dalam wishlist page
    }
}

window.onload = initializePage;

// add  event listeners untuk filter
document.getElementById('brand-select').addEventListener('change', () => {
    const brand = document.getElementById('brand-select').value;
    const category = document.getElementById('category-select').value;
    fetchProducts(brand, category);
});

document.getElementById('category-select').addEventListener('change', () => {
    const brand = document.getElementById('brand-select').value;
    const category = document.getElementById('category-select').value;
    fetchProducts(brand, category);
});
