const API_BASE_URL = "http://localhost:5000";

const mockJourneys = [
  {
    trainName: "Shatabdi Express",
    route: "New Delhi to Chandigarh",
    time: "07:40 - 11:05",
    status: "Confirmed",
    seat: "C2 / 18"
  },
  {
    trainName: "Mumbai Rajdhani Express",
    route: "Mumbai to Delhi",
    time: "06:00 - 20:30",
    status: "Upcoming",
    seat: "B3 / 21"
  }
];

const params = new URLSearchParams(window.location.search);
const isSignup = params.get("signup");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (isSignup === "true") {
  loginForm?.classList.remove("active");
  signupForm?.classList.add("active");
} else {
  signupForm?.classList.remove("active");
  loginForm?.classList.add("active");
}


const seatOptions = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"];
const page = document.body.dataset.page;
function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      
      buttons.forEach((item) => item.classList.remove("active"));

      
      button.classList.add("active");

      
      document.querySelectorAll(".form[data-form]").forEach((form) => {
        form.classList.remove("active");
      });

      
      const activeForm = document.querySelector(
        `.form[data-form="${button.dataset.tab}"]`
      );

      if (activeForm) activeForm.classList.add("active");
    });
  });

  
  const switchLinks = document.querySelectorAll(".switch-link");

  switchLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.dataset.switch;

      const targetBtn = document.querySelector(
        `.tab-btn[data-tab="${target}"]`
      );

      if (targetBtn) targetBtn.click();
    });
  });
}

function startTrainFacts() {
  const facts = [
    "🚆 Indian Railways is the 4th largest railway network in the world.",
    "🚄 Vande Bharat trains reach speeds up to 160 km/h.",
    "🌉 Chenab Bridge is the highest railway bridge in the world.",
    "🚉 India has over 7,000 railway stations.",
    "🛤️ Longest train route in India is over 4,200 km."
  ];

  let index = 0;
  const factElement = document.getElementById("trainFact");

  if (!factElement) return;

  setInterval(() => {
    factElement.classList.add("fade");

    setTimeout(() => {
      index = (index + 1) % facts.length;
      factElement.textContent = facts[index];
      factElement.classList.remove("fade");
    }, 500);

  }, 5000);
}
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  setupThemeToggle();

  setupTabs(); 

  setupNotifications();

  if (page === "auth") {
    bindAuthForms();
    startTrainFacts();
  }

  if (page === "dashboard") {
    protectDashboard();
    renderWelcomeMessage();
    renderJourneys();
    renderSeatMap();
    bindDashboardActions();
    fetchFoodItems();
    fetchComplaintCategories();
    hydrateCart();
  }
});
function applyTheme() {
  const theme = localStorage.getItem("railTheme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const syncLabel = () => {
    toggle.textContent = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
  };

  syncLabel();
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("railTheme", document.body.classList.contains("dark") ? "dark" : "light");
    syncLabel();
  });
}

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      document.querySelectorAll(".form[data-form]").forEach((form) => form.classList.remove("active"));
      const activeForm = document.querySelector(`.form[data-form="${button.dataset.tab}"]`);
      if (activeForm) activeForm.classList.add("active");
    });
  });
}

function setupNotifications() {
  const notifyBtn = document.getElementById("notifyBtn");
  if (!notifyBtn) return;

  notifyBtn.addEventListener("click", () => {
    showToast("2 travel alerts: food delivery window open and train running on time.");
  });
}

function bindAuthForms() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());

    if (!validateEmail(payload.email)) {
      showToast("Enter a valid email address.");
      return;
    }

    await handleAuthRequest("/auth/login", payload);
  });

  signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const payload = Object.fromEntries(formData.entries());

    if (!validateEmail(payload.email)) {
      showToast("Enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(payload.mobile)) {
      showToast("Enter a valid 10-digit mobile number.");
      return;
    }

    if (payload.password.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }

    await handleAuthRequest("/auth/signup", payload);
  });
}

async function handleAuthRequest(endpoint, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Authentication failed.");

    localStorage.setItem("railToken", data.token);
    localStorage.setItem("railUser", JSON.stringify(data.user));
    showToast(data.message);
    window.setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 800);
  } catch (error) {
    showToast(error.message);
  }
}

function protectDashboard() {
  const user = getStoredUser();
  if (!user) {
    showToast("Please login to access the dashboard.");
    window.setTimeout(() => {
      window.location.href = "./login.html";
    }, 700);
  }
}

function renderWelcomeMessage() {
  const welcomeTitle = document.getElementById("welcomeTitle");
  const user = getStoredUser();
  if (welcomeTitle && user) {
    welcomeTitle.textContent = `Hello, ${user.name.split(" ")[0]}`;
  }
}

function renderJourneys() {
  const container = document.getElementById("journeyCards");
  if (!container) return;

  container.innerHTML = mockJourneys.map((journey) => `
    <article class="journey-card">
      <span class="badge ${journey.status === "Confirmed" ? "success" : ""}">${journey.status}</span>
      <h3>${journey.trainName}</h3>
      <div class="journey-meta">
        <span>${journey.route}</span>
        <span>${journey.time}</span>
        <span>Seat ${journey.seat}</span>
      </div>
    </article>
  `).join("");
}

function bindDashboardActions() {
  const searchForm = document.getElementById("trainSearchForm");
  const bookingForm = document.getElementById("bookingForm");
  const pnrForm = document.getElementById("pnrForm");
  const trackForm = document.getElementById("trackForm");
  const foodOrderForm = document.getElementById("foodOrderForm");
  const helpForm = document.getElementById("helpForm");
  const logoutBtn = document.getElementById("logoutBtn");

  document.querySelectorAll(".action-card").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.target);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  searchForm?.addEventListener("submit", handleTrainSearch);
  bookingForm?.addEventListener("submit", handleBooking);
  pnrForm?.addEventListener("submit", handlePnrCheck);
  trackForm?.addEventListener("submit", handleTrainTrack);
  foodOrderForm?.addEventListener("submit", handleFoodOrder);
  helpForm?.addEventListener("submit", handleHelpRequest);

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("railToken");
    localStorage.removeItem("railUser");
    showToast("Logged out successfully.");
    window.setTimeout(() => {
      window.location.href = "./login.html";
    }, 700);
  });
}

async function handleTrainSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const params = new URLSearchParams(formData).toString();

  try {
    const response = await fetch(`${API_BASE_URL}/trains?${params}`);
    const data = await response.json();
    renderTrainResults(data.trains);
  } catch (error) {
    showToast("Unable to fetch trains right now.");
  }
}

function renderTrainResults(trains) {
  const container = document.getElementById("trainResults");
  if (!container) return;

  if (!trains.length) {
    container.innerHTML = `<div class="card empty-state">No trains found for this route.</div>`;
    return;
  }

  container.innerHTML = trains.map((train) => `
    <article class="train-card">
      <span class="pill">${train.trainNumber}</span>
      <h3>${train.name}</h3>
      <div class="train-meta">
        <span>${train.source} to ${train.destination}</span>
        <span>${train.departure} to ${train.arrival} • ${train.duration}</span>
        <span>${train.availability}</span>
        <strong>Rs. ${train.price}</strong>
      </div>
      <div class="train-actions">
        <span class="badge">${train.availability}</span>
        <button class="primary-btn" type="button" onclick='selectTrain(${JSON.stringify(train)})'>Book Now</button>
      </div>
    </article>
  `).join("");
}

window.selectTrain = function selectTrain(train) {
  localStorage.setItem("selectedTrain", JSON.stringify(train));
  document.getElementById("selectedTrainId").value = train.id;
  document.getElementById("selectedTrainSummary").innerHTML = `
    <h3>${train.name}</h3>
    <p>${train.source} to ${train.destination}</p>
    <p>${train.departure} to ${train.arrival}</p>
    <p><strong>Rs. ${train.price}</strong></p>
  `;
  document.getElementById("bookingSection").scrollIntoView({ behavior: "smooth" });
  showToast(`${train.name} selected for booking.`);
};

function renderSeatMap() {
  const seatMap = document.getElementById("seatMap");
  if (!seatMap) return;

  seatMap.innerHTML = seatOptions.map((seat) => `<button class="seat" type="button" data-seat="${seat}">${seat}</button>`).join("");

  seatMap.querySelectorAll(".seat").forEach((seatButton) => {
    seatButton.addEventListener("click", () => {
      seatMap.querySelectorAll(".seat").forEach((item) => item.classList.remove("selected"));
      seatButton.classList.add("selected");
    });
  });
}

async function handleBooking(event) {
  event.preventDefault();

  const selectedTrain = JSON.parse(localStorage.getItem("selectedTrain") || "null");
  const selectedSeat = document.querySelector(".seat.selected")?.dataset.seat;
  const user = getStoredUser();

  if (!selectedTrain) {
    showToast("Please select a train first.");
    return;
  }

  if (!selectedSeat) {
    showToast("Please choose a seat.");
    return;
  }

  const passengerName = document.getElementById("passengerName").value.trim();
  const passengerAge = document.getElementById("passengerAge").value;
  const journeyDate = document.getElementById("journeyDate").value;

  if (!passengerName || !passengerAge || !journeyDate) {
    showToast("Please complete booking details.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainId: selectedTrain.id,
        journeyDate,
        userId: user.id,
        passenger: {
          name: passengerName,
          age: Number(passengerAge),
          seat: selectedSeat
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Booking failed.");

    document.getElementById("bookingConfirmation").classList.remove("hidden");
    document.getElementById("bookingConfirmation").innerHTML = `
      <h3>Booking Confirmation</h3>
      <p><strong>PNR:</strong> ${data.booking.pnr}</p>
      <p><strong>Status:</strong> ${data.booking.bookingStatus}</p>
      <p><strong>Coach/Seat:</strong> ${data.booking.passenger.seat}</p>
      <p><strong>Journey:</strong> ${data.booking.source} to ${data.booking.destination}</p>
    `;
    showToast("Booking confirmed successfully.");
    event.target.reset();
    renderSeatMap();
  } catch (error) {
    showToast(error.message);
  }
}

async function handlePnrCheck(event) {
  event.preventDefault();
  const pnr = document.getElementById("pnrInput").value.trim();

  if (!/^\d{6,10}$/.test(pnr)) {
    showToast("Enter a valid PNR number.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/pnr/${pnr}`);
    const data = await response.json();
    document.getElementById("pnrResult").innerHTML = `
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Coach:</strong> ${data.coach}</p>
      <p><strong>Seat:</strong> ${data.seat}</p>
      <p><strong>Train:</strong> ${data.trainName}</p>
    `;
  } catch (error) {
    showToast("Unable to fetch PNR status.");
  }
}

function handleTrainTrack(event) {
  event.preventDefault();
  const trainNumber = document.getElementById("trackTrainNumber").value.trim();

  if (!trainNumber) {
    showToast("Enter a train number.");
    return;
  }

  const delayed = Number(trainNumber.slice(-1)) % 2 === 0;
  document.getElementById("trackingResult").innerHTML = `
    <p><strong>Train Number:</strong> ${trainNumber}</p>
    <p><strong>Status:</strong> ${delayed ? "Delayed by 12 min" : "On time"}</p>
    <p><strong>Current Location:</strong> Near Mathura Junction</p>
    <p><strong>Next Stop:</strong> Agra Cantt</p>
  `;
}

async function fetchFoodItems() {
  const container = document.getElementById("foodList");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/food`);
    const data = await response.json();
    container.innerHTML = data.items.map((item) => `
      <article class="food-card">
        <span class="pill">${item.category}</span>
        <h3>${item.name}</h3>
        <div class="food-meta">
          <span>ETA ${item.eta}</span>
          <strong>Rs. ${item.price}</strong>
        </div>
        <div class="food-actions">
          <span class="badge">${item.eta}</span>
          <button class="primary-btn" type="button" onclick='addToCart(${JSON.stringify(item)})'>Add</button>
        </div>
      </article>
    `).join("");
  } catch (error) {
    container.innerHTML = `<div class="card empty-state">Unable to load food items.</div>`;
  }
}

window.addToCart = function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("railCart") || "[]");
  cart.push(item);
  localStorage.setItem("railCart", JSON.stringify(cart));
  hydrateCart();
  showToast(`${item.name} added to cart.`);
};

function hydrateCart() {
  const cart = JSON.parse(localStorage.getItem("railCart") || "[]");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  if (!cartItems || !cartCount) return;

  cartCount.textContent = `${cart.length} item${cart.length === 1 ? "" : "s"}`;
  if (!cart.length) {
    cartItems.innerHTML = "Your cart is empty.";
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartItems.innerHTML = `
    ${cart.map((item, index) => `<p>${index + 1}. ${item.name} - Rs. ${item.price}</p>`).join("")}
    <hr />
    <p><strong>Total:</strong> Rs. ${total}</p>
  `;
}

async function handleFoodOrder(event) {
  event.preventDefault();
  const cart = JSON.parse(localStorage.getItem("railCart") || "[]");
  const customerName = document.getElementById("foodCustomerName").value.trim();
  const trainNumber = document.getElementById("foodTrainNumber").value.trim();

  if (!cart.length) {
    showToast("Add at least one food item.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/food/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, customerName, trainNumber })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Food order failed.");

    document.getElementById("foodOrderStatus").innerHTML = `
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>ETA:</strong> ${data.eta}</p>
    `;
    localStorage.removeItem("railCart");
    hydrateCart();
    event.target.reset();
    showToast("Food order placed successfully.");
  } catch (error) {
    showToast(error.message);
  }
}

async function fetchComplaintCategories() {
  const categorySelect = document.getElementById("helpCategory");
  if (!categorySelect) return;

  try {
    const response = await fetch(`${API_BASE_URL}/help/categories`);
    const data = await response.json();
    categorySelect.innerHTML = `
      <option value="">Select category</option>
      ${data.categories.map((category) => `<option value="${category}">${category}</option>`).join("")}
    `;
  } catch (error) {
    categorySelect.innerHTML = `<option value="">Unable to load categories</option>`;
  }
}

async function handleHelpRequest(event) {
  event.preventDefault();
  const user = getStoredUser();
  const category = document.getElementById("helpCategory").value;
  const trainNumber = document.getElementById("helpTrainNumber").value.trim();
  const message = document.getElementById("helpMessage").value.trim();

  if (!category || !trainNumber || !message) {
    showToast("Please complete the complaint form.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/help`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, category, trainNumber, message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Complaint submission failed.");

    document.getElementById("helpStatus").innerHTML = `
      <p><strong>Category:</strong> ${data.complaint.category}</p>
      <p><strong>Status:</strong> ${data.complaint.status}</p>
      <p><strong>Train Number:</strong> ${data.complaint.trainNumber}</p>
    `;
    event.target.reset();
    showToast("Complaint submitted successfully.");
  } catch (error) {
    showToast(error.message);
  }
}

function getStoredUser() {
  const user = localStorage.getItem("railUser");
  return user ? JSON.parse(user) : null;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3000);
}
