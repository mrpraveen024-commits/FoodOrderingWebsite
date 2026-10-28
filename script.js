
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
    image: "https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=500"
  },
  {
    id: 4,
    name: "Dosa",
    price: 90,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let orderHistory =
  JSON.parse(localStorage.getItem("orderHistory")) || [];


function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

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



function filterFoods(category) {
  // Highlight the selected category button
  const buttons = document.querySelectorAll(".categories button");

  buttons.forEach(button => {
    button.classList.remove("active");
  });

  const selectedButton = [...buttons].find(
    button => button.textContent.trim() ===
      (category === "All" ? "All Foods" : category)
  );

  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  // Filter the food items
  if (category === "All") {
    displayFoods(foods);
  } else {
    const filteredFoods = foods.filter(
      food => food.name === category
    );

    displayFoods(filteredFoods);
  }
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
  saveCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(food => food.id === id);
  if (!item) return;

  item.quantity += amount;
  cart = cart.filter(food => food.quantity > 0);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
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
    <button onclick="removeFromCart(${item.id})">Remove</button>
  </p>
`).join("");
  }

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = count;
  totalElement.textContent = total;
  document.getElementById("final-total").textContent =
  total + (cart.length > 0 ? 30 : 0);
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
  saveCart();
  renderCart();
});

displayFoods(foods);
renderCart();


displayFoods(foods);
renderCart();

// ADD THE NEW CODE BELOW THIS LINE


document.getElementById("place-order").addEventListener("click", () => {
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in all delivery details.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  if (cart.length === 0) {
    alert("Please add food to your cart first.");
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (subtotal < 100) {
    alert("Minimum order amount is ₹100.");
    return;
  }

  const finalTotal = document.getElementById("final-total").textContent;
  const message = document.getElementById("message");

  message.textContent =
    `Thank you, ${name}! Your order has been placed. Final total: ₹${finalTotal}.`;

  message.style.color = "green";

  const order = {
    customerName: name,
    phone: phone,
    address: address,
    items: cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    subtotal: subtotal,
    deliveryFee: 30,
    total: Number(finalTotal),
    orderDate: new Date().toLocaleString()
  };

  orderHistory.push(order);

  localStorage.setItem(
    "orderHistory",
    JSON.stringify(orderHistory)
  );

  displayOrderHistory();

  cart = [];
  saveCart();
  renderCart();
});

function displayOrderHistory() {
  const historyContainer =
    document.getElementById("order-history");

  if (orderHistory.length === 0) {
    historyContainer.textContent = "No previous orders yet.";
    return;
  }

  historyContainer.innerHTML = orderHistory
    .map((order, index) => `
      <div class="order-card">
        <h3>Order #${index + 1}</h3>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Date:</strong> ${order.orderDate}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${order.items.map(item => `
            <li>${item.name} × ${item.quantity} — ₹${item.price * item.quantity}</li>
          `).join("")}
        </ul>
        <p><strong>Delivery fee:</strong> ₹${order.deliveryFee}</p>
        <p><strong>Total:</strong> ₹${order.total}</p>
      </div>
    `).join("");
}

displayOrderHistory();

const clearButton = document.getElementById("clear-history");

if (clearButton) {
  clearButton.addEventListener("click", () => {
    const confirmClear = confirm(
      "Are you sure you want to clear all order history?"
    );

    if (!confirmClear) return;

    orderHistory = [];
    localStorage.removeItem("orderHistory");
    displayOrderHistory();
  });
}



