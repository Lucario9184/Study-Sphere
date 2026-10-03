/**
 * STUDYSPHERE — BOOKMARKS SYSTEM (js/bookmarks.js)
 * Clean localStorage persistence for student bookmarks.
 * Reusable across cards, resource viewer, and bookmarks page.
 */

/**
 * Returns array of bookmarked resource IDs
 * @returns {Array<string>}
 */
function getBookmarkedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading bookmarks:", e);
    return [];
  }
}

/**
 * Saves array of bookmark IDs to localStorage
 * @param {Array<string>} ids
 */
function saveBookmarkedIds(ids) {
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(ids));
}

/**
 * Toggles bookmark status for a given resource ID
 * @param {string} resourceId
 * @param {Function} [onToggle] - Callback receiving (isBookmarked)
 */
function toggleBookmark(resourceId, onToggle) {
  let bookmarks = getBookmarkedIds();
  const index = bookmarks.indexOf(resourceId);
  let isNowBookmarked = false;

  if (index >= 0) {
    // Already bookmarked -> Remove it
    bookmarks.splice(index, 1);
    showToast('Removed from your bookmarks', 'info');
    isNowBookmarked = false;
  } else {
    // Not bookmarked -> Add it
    bookmarks.push(resourceId);
    showToast('Resource saved to Bookmarks!', 'success');
    isNowBookmarked = true;
  }

  saveBookmarkedIds(bookmarks);

  if (typeof onToggle === 'function') {
    onToggle(isNowBookmarked);
  }
}

/**
 * Renders the bookmarks page (bookmarks.html)
 */
function initBookmarksPage() {
  const container = document.getElementById('bookmarks-grid');
  const emptyState = document.getElementById('bookmarks-empty');
  const countBadge = document.getElementById('bookmarks-count');

  if (!container) return;

  const bookmarkedIds = getBookmarkedIds();
  const allResources = getAllResources();
  const savedResources = allResources.filter(r => bookmarkedIds.includes(r.id));

  if (countBadge) {
    countBadge.textContent = `${savedResources.length} ${savedResources.length === 1 ? 'Resource' : 'Resources'}`;
  }

  if (savedResources.length === 0) {
    container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  container.style.display = 'grid';

  // Render cards
  container.innerHTML = savedResources.map(res => renderResourceCardHtml(res)).join('');
  attachCardBookmarkListeners(container);
}

// Auto-run if on bookmarks page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bookmarks-grid')) {
    initBookmarksPage();
  }
});
