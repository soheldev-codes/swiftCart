let products = [];
let topProducts= [];
let categories = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.getElementById('cart-count');
const productGrid = document.getElementById('product-grid');
const categoryContainer = document.getElementById('category-buttons');

updateCartCount();

function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Fetch all categories
async function loadCategories() {
  categories = await fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json());
  renderCategories();
}

// Top 3 data
async function topLoadProducts(category = '') {
  let url = 'https://fakestoreapi.com/products';
  if (category) {
    url = `https://fakestoreapi.com/products/category/${category}`;
  }
  console.log(url)

 topProducts = await fetch(url).then(res => res.json());


  // 🔥 Top 3 select
  const top3 = topProducts.slice(0, 3);

  renderTop3(top3);
}

// Top 3 product display
function renderTop3(items) {
  const topSection = document.getElementById('top-products');
  topSection.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg   overflow-hidden space-y-2';
    card.innerHTML = `
      <div class="bg-gray-200 p-4"> <img src="${item.image}" class="w-full h-48 object-cover" alt="${item.title}"></div>
      <div class="p-4">
      <div class="flex justify-between">
      <p class="text-gray-600">${item.category}</p>
      <p class="text-yellow-500">${'★'.repeat(Math.round(item.rating.rate)) } <span class="text-gray-400">${item.rating.rate} (${item.rating.count}) </span> </p>
      </div>
        <h3 class="font-semibold text-lg my-2 truncate">${item.title}</h3>
        
        <p class="font-bold">$${item.price}</p>
        
        <div class="mt-2 flex gap-2">
          <button class=" text-gray-500 border border-gray-200 px-4 py-2 rounded-md modal-btn"><i class="fas fa-eye"></i> Details</button>
          <button class="bg-indigo-500 text-white px-2 py-1 rounded add-cart-btn"><i class="fas fa-cart-plus"></i> Add to Cart</button>
        </div>
      </div>
    `;

    topSection.appendChild(card);
  });
}




// Render category buttons
function renderCategories() {
  categoryContainer.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.textContent = 'All';
  allBtn.className = 'px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700';
  allBtn.onclick = () => loadProducts();
  categoryContainer.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'px-4 py-2 bg-gray-200 rounded cursor-pointer  duration-100 hover:bg-gray-300';
    btn.onclick = () => loadProducts(cat);
    categoryContainer.appendChild(btn);
  });
}

// Fetch products (all or by category)
async function loadProducts(category = '') {
  let url = 'https://fakestoreapi.com/products';
  if (category) url = `https://fakestoreapi.com/products/category/${category}`;
  products = await fetch(url).then(res => res.json());
  renderProducts(products);
  console.log(products)
}

// Render product cards
function renderProducts(items) {
  productGrid.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg  overflow-hidden space-y-2';
    card.innerHTML = `
      <div class="bg-gray-200 p-4"> <img src="${item.image}" class="w-full h-48 object-cover" alt="${item.title}"></div>
      <div class="p-4">
      <div class="flex justify-between">
      <p class="text-gray-600">${item.category}</p>
      <p class="text-yellow-500">${'★'.repeat(Math.round(item.rating.rate)) } <span class="text-gray-400">${item.rating.rate} (${item.rating.count}) </span> </p>
      </div>
        <h3 class="font-semibold text-lg my-2 truncate">${item.title}</h3>
        
        <p class="font-bold">$${item.price}</p>
        
        <div class="mt-2 flex gap-2">
          <button class=" text-gray-500 border border-gray-200 px-4 py-2 rounded-md modal-btn"><i class="fas fa-eye"></i> Details</button>
          <button class="bg-indigo-500 text-white px-2 py-1 rounded add-cart-btn"><i class="fas fa-cart-plus"></i> Add to Cart</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);

    // Modal
    const modalBtn = card.querySelector('.modal-btn');
    modalBtn.onclick = () => openModal(item.id);

    // Add to cart
    const addBtn = card.querySelector('.add-cart-btn');
    addBtn.onclick = () => {
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    };
  });
}

// Modal logic
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
closeModalBtn.onclick = () => modal.classList.add('hidden');

async function openModal(id) {
  const item = await fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json());
  document.getElementById('modal-img').src = item.image;
  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-desc').textContent = item.description;
  document.getElementById('modal-price').textContent = `$${item.price}`;
  document.getElementById('modal-rating').textContent = '★'.repeat(Math.round(item.rating.rate));
  document.getElementById('modal-add-cart').onclick = () => {
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    modal.classList.add('hidden'); // modal add to cart korle close hobe.
  };
  modal.classList.remove('hidden');
}

// Initialize
loadCategories();
loadProducts();
topLoadProducts()