/**
 * STUDYSPHERE — BOOKMARKS SYSTEM (js/bookmarks.js)
 * Clean localStorage persistence for student bookmarks.
 * Reusable across cards, resource viewer, and bookmarks page.
 */

/**
 * Loads entire bookmarks dictionary from localStorage and migrates if needed
 * @returns {Object} { [userEmail]: Array<string> }
 */
function getBookmarksStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Old global format: array of resource IDs. Migrate to current user bucket.
      const email = getCurrentUserEmail();
      if (email) {
        const migrated = { [email]: parsed };
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(migrated));
        return migrated;
      }
      return {};
    }
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return {};
  } catch (e) {
    console.error("Error reading bookmarks store:", e);
    return {};
  }
}

/**
 * Returns array of bookmarked resource IDs for the current user
 * @returns {Array<string>}
 */
function getBookmarkedIds() {
  const email = getCurrentUserEmail();
  if (!email) return [];
  const store = getBookmarksStore();
  const userBookmarks = store[email];
  return Array.isArray(userBookmarks) ? userBookmarks : [];
}

/**
 * Saves array of bookmark IDs for the current user to localStorage
 * @param {Array<string>} ids
 */
function saveBookmarkedIds(ids) {
  const email = getCurrentUserEmail();
  if (!email) return; // never write to a shared bucket if no user
  const store = getBookmarksStore();
  store[email] = Array.isArray(ids) ? ids : [];
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(store));
}

/**
 * Toggles bookmark status for a given resource ID
 * @param {string} resourceId
 * @param {Function} [onToggle] - Callback receiving (isBookmarked)
 */
function toggleBookmark(resourceId, onToggle) {
  const email = getCurrentUserEmail();
  if (!email) {
    showToast('Please login to bookmark resources', 'info');
    return;
  }

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
