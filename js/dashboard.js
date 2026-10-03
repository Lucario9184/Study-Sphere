/**
 * STUDYSPHERE — DASHBOARD CONTROLLER (js/dashboard.js)
 * Manages student dashboard analytics, recently viewed list (max 5),
 * bookmarks preview, subject progress bars, and recommendations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check user login status
  const user = getCurrentUser();
  if (!user) {
    // If not logged in, prompt user to demo login
    showToast('Please login to access your personal dashboard', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
    return;
  }

  // 2. Personalize greeting
  const greetingEl = document.getElementById('user-welcome-name');
  if (greetingEl) {
    greetingEl.textContent = user.name;
  }

  const roleBadge = document.getElementById('user-role-badge');
  if (roleBadge) {
    roleBadge.textContent = user.role.toUpperCase();
  }

  // 3. Render Metric Cards
  renderOverviewMetrics();

  // 4. Render Recently Viewed (Max 5 items)
  renderRecentlyViewedSection();

  // 5. Render Subject Progress Bars
  renderSubjectProgressSection();

  // 6. Render My Bookmarks Preview
  renderBookmarksPreviewSection();

  // 7. Render Recommended Resources (Top Rated)
  renderRecommendedSection();
});

/**
 * Updates top overview numerical counters
 */
function renderOverviewMetrics() {
  const allResources = getAllResources();
  const bookmarkedIds = getBookmarkedIds();
  const progressRecords = getProgressRecords();
  const recentItems = getRecentlyViewedItems();

  const completedCount = Object.keys(progressRecords).length;
  const overall = getOverallProgress();

  document.getElementById('metric-viewed').textContent = recentItems.length;
  document.getElementById('metric-bookmarks').textContent = bookmarkedIds.length;
  document.getElementById('metric-completed').textContent = completedCount;
  document.getElementById('metric-overall-progress').textContent = `${overall.percentage}%`;
}

/**
 * Fetches recently viewed array from localStorage
 * @returns {Array<{id: string, viewedAt: string}>}
 */
function getRecentlyViewedItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Renders the Recently Viewed / Continue Learning section
 */
function renderRecentlyViewedSection() {
  const container = document.getElementById('recent-resources-container');
  const emptyEl = document.getElementById('recent-empty');
  if (!container) return;

  const recentItems = getRecentlyViewedItems();

  if (recentItems.length === 0) {
    container.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  container.style.display = 'grid';

  // Map recent items to resource data
  const cardsHtml = recentItems.map(item => {
    const res = getResourceById(item.id);
    if (!res) return '';

    // Relative format for viewed date
    const dateStr = item.viewedAt ? new Date(item.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';

    return `
      <div class="resource-card" style="padding: 1.15rem;">
        <div class="card-top" style="margin-bottom: 0.5rem;">
          <span class="card-badge ${res.type === 'PDF' ? 'badge-pdf' : 'badge-lecture'}">
            ${res.type === 'PDF' ? '📄 Notes' : '🎥 Lecture'}
          </span>
          <span style="font-size: 0.75rem; color: var(--text-light);">Viewed ${dateStr}</span>
        </div>

        <h4 class="card-title" style="font-size: 1rem;">
          <a href="resource.html?id=${res.id}">${escapeHtml(res.title)}</a>
        </h4>

        <div class="card-meta" style="margin-bottom: 0.75rem;">
          <span>📚 ${escapeHtml(res.subject)}</span>
        </div>

        <div style="margin-top: auto;">
          <a href="resource.html?id=${res.id}" class="btn btn-outline btn-sm" style="width: 100%;">
            Resume Learning &rarr;
          </a>
        </div>
      </div>
    `;
  }).filter(Boolean).join('');

  container.innerHTML = cardsHtml;
}

/**
 * Renders simple visual subject progress bars
 */
function renderSubjectProgressSection() {
  const container = document.getElementById('subject-progress-container');
  if (!container) return;

  const subjects = [
    { name: "Engineering Physics", icon: "⚛️" },
    { name: "Engineering Mathematics", icon: "📐" },
    { name: "Programming / C", icon: "💻" },
    { name: "Electrical Engineering", icon: "⚡" },
    { name: "Engineering Chemistry", icon: "🧪" }
  ];

  container.innerHTML = subjects.map(sub => {
    const stat = getSubjectProgress(sub.name);
    let colorClass = 'var(--primary-color)';
    if (stat.percentage >= 66) colorClass = 'var(--success-color)';
    else if (stat.percentage >= 33) colorClass = 'var(--warning-color)';

    return `
      <div class="progress-card">
        <div class="progress-header">
          <span>${sub.icon} ${escapeHtml(sub.name)}</span>
          <span style="color: ${colorClass}; font-weight: 700;">${stat.percentage}% (${stat.completed}/${stat.total})</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${stat.percentage}%; background-color: ${colorClass};"></div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Renders bookmarks preview
 */
function renderBookmarksPreviewSection() {
  const container = document.getElementById('dashboard-bookmarks-grid');
  const emptyEl = document.getElementById('dashboard-bookmarks-empty');
  if (!container) return;

  const bookmarkedIds = getBookmarkedIds();
  const allResources = getAllResources();
  const saved = allResources.filter(r => bookmarkedIds.includes(r.id)).slice(0, 3);

  if (saved.length === 0) {
    container.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  container.style.display = 'grid';
  container.innerHTML = saved.map(r => renderResourceCardHtml(r)).join('');
  attachCardBookmarkListeners(container);
}

/**
 * Renders top-rated recommendations
 */
function renderRecommendedSection() {
  const container = document.getElementById('dashboard-recommended-grid');
  if (!container) return;

  const recommended = filterResources({ sortBy: 'rating' }).slice(0, 3);
  container.innerHTML = recommended.map(r => renderResourceCardHtml(r)).join('');
  attachCardBookmarkListeners(container);
}
