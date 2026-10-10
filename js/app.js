/**
 * STUDYSPHERE — GLOBAL UTILITIES & NAVIGATION (js/app.js)
 * Clean, beginner-friendly helper script loaded across all pages.
 * Handles navigation state, user profile badge, and toast notifications.
 */

// --- 1. GLOBAL STATE & HELPERS ---
const STORAGE_KEYS = {
  CURRENT_USER: 'studysphere_current_user',
  USERS: 'studysphere_users',
  RESOURCES: 'studysphere_resources',
  BOOKMARKS: 'studysphere_bookmarks',
  RATINGS: 'studysphere_ratings',
  PROGRESS: 'studysphere_progress',
  RECENTLY_VIEWED: 'studysphere_recent',
  SESSION_SEEDED: 'studysphere_session_seeded'
};

// Seed default demo user session only on the very first visit
(function initDefaultSession() {
  const sessionSeeded = localStorage.getItem('studysphere_session_seeded');
  if (!sessionSeeded) {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
        name: "Alex Johnson",
        email: "student@example.com",
        role: "student"
      }));
    }
    localStorage.setItem('studysphere_session_seeded', 'true');
  }
})();

/**
 * Retrieves the current logged in user from localStorage
 * @returns {Object|null}
 */
function getCurrentUser() {
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}

/**
 * Checks if current user is an admin
 * @returns {boolean}
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

/**
 * Logs out the current user and redirects to login.html
 */
function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 600);
}

// --- 2. TOAST NOTIFICATION SYSTEM ---
/**
 * Shows an attractive, non-intrusive toast banner
 * @param {string} message - Message to display
 * @param {'success'|'error'|'info'} type - Type of toast
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon based on type
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span>${icon}</span>
      <span>${escapeHtml(message)}</span>
    </div>
    <button style="background:transparent;border:none;color:white;cursor:pointer;font-size:1.1rem;line-height:1;" aria-label="Close">&times;</button>
  `;

  // Close button click
  toast.querySelector('button').addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3500);
}

/**
 * Basic HTML escaping helper to prevent XSS in dynamic renders
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Helper to get URL query parameter by name
 * Example: getQueryParam('id') -> 'res_1'
 */
function getQueryParam(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
}

// --- 3. DYNAMIC NAVIGATION BAR SETUP ---
/**
 * Injects or updates the navigation bar to reflect current user status
 */
function initNavigation() {
  const navContainer = document.querySelector('.nav-container');
  if (!navContainer) return;

  const user = getCurrentUser();
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Toggle mobile navigation menu
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navLinks = document.querySelector('.nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Highlight active link
  if (navLinks) {
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });

    // If user is admin, make sure Admin link exists
    if (user && user.role === 'admin') {
      const existingAdmin = navLinks.querySelector('.admin-link');
      if (!existingAdmin) {
        const adminLi = document.createElement('li');
        adminLi.innerHTML = `<a href="admin.html" class="admin-link ${currentPath === 'admin.html' ? 'active' : ''}">🛡️ Admin</a>`;
        navLinks.appendChild(adminLi);
      }
    }
  }

  // Update Auth action section
  const navAuth = document.querySelector('.nav-auth');
  if (navAuth) {
    if (user) {
      navAuth.innerHTML = `
        <div class="nav-user-badge" title="Logged in as ${escapeHtml(user.name)} (${escapeHtml(user.role)})">
          <span class="nav-user-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</span>
          <span>${escapeHtml(user.name)}</span>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-logout" title="Log out">Logout</button>
      `;

      document.getElementById('btn-logout').addEventListener('click', logoutUser);
    } else {
      navAuth.innerHTML = `
        <a href="login.html" class="btn btn-primary btn-sm">Login / Register</a>
      `;
    }
  }
}

// Run navigation initialization once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
});
