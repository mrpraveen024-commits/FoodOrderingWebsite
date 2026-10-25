
const foods = [
  {
    id: 1,
    name: "Pizza",
    price: 150,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
  },
  {
    id: 2,
    name: "Burger",
    price: 99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
  },
  {
    id: 3,
    name: "Biryani",
    price: 120,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500"
  },
  {
    id: 4,
    name: "Dosa",
    price: 90,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500"
  }
];

let cart = [];

const foodList = document.getElementById("food-list");
const cartItems = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cart-count");

function displayFoods(items) {
  foodList.innerHTML = items.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}">
      <h3>${food.name}</h3>
      <p>Price: ₹${food.price}</p>
      <button onclick="addToCart(${food.id})">
        Add to Cart
      </button>
    </article>
  `).join("");
}

function addToCart(id) {
  const item = cart.find(food => food.id === id);

  if (item) {
    item.quantity++;
  } else {
    const food = foods.find(food => food.id === id);
    cart.push({ ...food, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(food => food.id === id);
  if (!item) return;

  item.quantity += amount;
  cart = cart.filter(food => food.quantity > 0);

  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.textContent = "Your cart is empty.";
  } else {
    cartItems.innerHTML = cart.map(item => `
      <p>
        ${item.name} - ₹${item.price} × ${item.quantity}
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="changeQuantity(${item.id}, -1)">−</button>
      </p>
    `).join("");
  }

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = count;
  totalElement.textContent = total;
}

document.getElementById("search").addEventListener("input", event => {
  const query = event.target.value.toLowerCase();

  displayFoods(
    foods.filter(food => food.name.toLowerCase().includes(query))
  );
});

document.getElementById("cart-button").addEventListener("click", () => {
  document.getElementById("cart-section").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("checkout").addEventListener("click", () => {
  const message = document.getElementById("message");

  if (cart.length === 0) {
    message.textContent = "Please add food to your cart first.";
    return;
  }

  message.textContent =
    `Demo order placed! Total: ₹${totalElement.textContent}`;

  cart = [];
  renderCart();
});

displayFoods(foods);
renderCart();
