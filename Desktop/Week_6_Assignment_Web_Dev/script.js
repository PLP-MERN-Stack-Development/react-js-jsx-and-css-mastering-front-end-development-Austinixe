// =====================
// Light/Dark Mode Toggle
// =====================
const modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// =====================
// Counter Game Logic
// =====================
let counter = 0;
let highScore = 0;
let timeLeft = 30;
let timerInterval;

const counterDisplay = document.getElementById("counter");
const highScoreDisplay = document.getElementById("high-score");
const timerDisplay = document.getElementById("timer");
const incrementBtn = document.getElementById("increment-btn");
const resetBtn = document.getElementById("reset-btn");
const bonusMessage = document.getElementById("bonus-message");

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Time’s up! Final Score: " + counter);
      if (counter > highScore) {
        highScore = counter;
        highScoreDisplay.textContent = highScore;
      }
    }
  }, 1000);
}

incrementBtn.addEventListener("click", () => {
  if (timeLeft === 30) startTimer();
  counter++;
  counterDisplay.textContent = counter;

  // Random bonus
  if (Math.random() < 0.2) {
    counter += 5;
    counterDisplay.textContent = counter;
    bonusMessage.textContent = "🎉 Bonus +5!";
    setTimeout(() => (bonusMessage.textContent = ""), 1500);
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  counter = 0;
  counterDisplay.textContent = counter;
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  bonusMessage.textContent = "";
});

// =====================
// Tab Switching
// =====================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// =====================
// FAQ Toggle (Sidebar)
// =====================
const faqToggle = document.getElementById("faq-toggle");
const faqSidebar = document.getElementById("faq-sidebar");

faqToggle.addEventListener("click", () => {
  faqSidebar.classList.toggle("active");
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach((q) => {
  q.addEventListener("click", () => {
    q.classList.toggle("active");
    q.nextElementSibling.classList.toggle("active");
  });
});

// =====================
// Form Validation
// =====================
const form = document.getElementById("signup-form");
const formMessages = document.getElementById("form-messages");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // prevent form submission
  let errors = [];

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const language = document.getElementById("language-select").value;
  const experience = document.getElementById("experience").value;
  const motivation = document.getElementById("motivation").value.trim();

  // Name check
  if (name === "") errors.push("Full Name is required.");

  // Email check (basic regex)
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) errors.push("Enter a valid email address.");

  // Phone check (digits only)
  const phonePattern = /^[0-9+ ]{7,15}$/;
  if (!phone.match(phonePattern)) errors.push("Enter a valid phone number.");

  // Password check
  if (password.length < 6) errors.push("Password must be at least 6 characters.");
  if (password !== confirmPassword) errors.push("Passwords do not match.");

  // Dropdown checks
  if (language === "") errors.push("Please select a preferred programming language.");
  if (experience === "") errors.push("Please select your experience level.");

  // Motivation check
  if (motivation === "") errors.push("Please tell us why you want to join.");

  // Show messages
  if (errors.length > 0) {
    formMessages.innerHTML = `<ul><li>${errors.join("</li><li>")}</li></ul>`;
    formMessages.style.color = "red";
  } else {
    formMessages.textContent = "✅ Application submitted successfully!";
    formMessages.style.color = "green";
    form.reset();
  }
});
// ========== Dark/Light Mode Toggle ==========
const toggleBtn = document.getElementById("toggle-theme");

// Check if user has a saved preference in localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

// Toggle when button is clicked
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Save preference
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙 Dark Mode";
  }
});
