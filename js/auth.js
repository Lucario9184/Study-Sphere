/**
 * STUDYSPHERE — DEMO AUTHENTICATION SYSTEM (js/auth.js)
 * Frontend demo authentication using browser localStorage.
 * 
 * IMPORTANT HACKATHON DISCLAIMER:
 * This is a frontend demo authentication system for UI/UX walkthroughs.
 * In a production web application, authentication must be implemented
 * on a secure backend server with salted password hashing (e.g. bcrypt),
 * HTTPS, HTTP-only cookies/JWTs, and database-level role verification.
 */

// --- 1. DEFAULT DEMO ACCOUNTS SEED ---
const DEFAULT_DEMO_USERS = [
  {
    name: "Alex Johnson",
    email: "student@example.com",
    password: "student123",
    role: "student",
    createdAt: "2026-09-01"
  },
  {
    name: "Prof. Sarah Miller",
    email: "admin@studysphere.edu",
    password: "admin123",
    role: "admin",
    createdAt: "2026-08-15"
  }
];

/**
 * Initializes users storage with default student & admin accounts if empty
 */
function initUsersStorage() {
  const existing = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existing) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_DEMO_USERS));
  }

  // Seed default demo session only on the very first visit
  const sessionSeeded = localStorage.getItem('studysphere_session_seeded');
  if (!sessionSeeded) {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_DEMO_USERS[0]));
    }
    localStorage.setItem('studysphere_session_seeded', 'true');
  }
}

/**
 * Logs out the current user and redirects to login.html
 */
function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  if (typeof showToast === 'function') {
    showToast('Logged out successfully', 'info');
  }
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 600);
}

/**
 * Fetches all registered users
 * @returns {Array<Object>}
 */
function getAllUsers() {
  initUsersStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : DEFAULT_DEMO_USERS;
  } catch (e) {
    return DEFAULT_DEMO_USERS;
  }
}

/**
 * Authenticates user credentials against localStorage records
 * @param {string} email 
 * @param {string} password 
 * @returns {{success: boolean, message: string, user?: Object}}
 */
function loginUser(email, password) {
  const users = getAllUsers();
  const cleanEmail = email.trim().toLowerCase();
  
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    return { success: false, message: "No account found with this email address." };
  }

  if (found.password !== password) {
    return { success: false, message: "Incorrect password. Please try again." };
  }

  // Store active session in localStorage
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
    name: found.name,
    email: found.email,
    role: found.role
  }));

  return { success: true, message: "Logged in successfully!", user: found };
}

/**
 * Registers a new demo user in localStorage
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {{success: boolean, message: string}}
 */
function registerUser(name, email, password) {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, message: "Please fill in all required fields." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getAllUsers();

  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, message: "An account with this email already exists." };
  }

  const newUser = {
    name: name.trim(),
    email: cleanEmail,
    password: password,
    role: 'student',
    createdAt: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // Automatically log in newly registered user
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  }));

  return { success: true, message: "Registration successful! Welcome to StudySphere." };
}

// Auto-run user initialization
initUsersStorage();
