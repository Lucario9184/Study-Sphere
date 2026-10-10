/**
 * STUDYSPHERE — PROGRESS TRACKING (js/progress.js)
 * Clean, lightweight study completion tracker.
 * Allows students to "Mark as Read" (PDF) or "Mark as Completed" (Lectures),
 * and automatically computes progress percentages for each subject.
 */

/**
 * Loads entire progress dictionary from localStorage and migrates if needed
 * @returns {Object} { [userEmail]: { [resourceId]: boolean } }
 */
function getProgressStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Old global format: flat object with boolean values (e.g. { res_phy_1: true })
    const isOldFormat = parsed && typeof parsed === 'object' && !Array.isArray(parsed) &&
      Object.values(parsed).some(v => typeof v === 'boolean' || v === true);
    if (isOldFormat) {
      const email = getCurrentUserEmail();
      if (email) {
        const migrated = { [email]: parsed };
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(migrated));
        return migrated;
      }
      return {};
    }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch (e) {
    console.error("Error reading progress store:", e);
    return {};
  }
}

/**
 * Returns dictionary of completed resources for the current user
 * Structure: { [resourceId]: true }
 * @returns {Object}
 */
function getProgressRecords() {
  const email = getCurrentUserEmail();
  if (!email) return {};
  const store = getProgressStore();
  const userProgress = store[email];
  return (userProgress && typeof userProgress === 'object' && !Array.isArray(userProgress)) ? userProgress : {};
}

/**
 * Saves progress records dictionary for the current user to localStorage
 * @param {Object} records
 */
function saveProgressRecords(records) {
  const email = getCurrentUserEmail();
  if (!email) return; // never write to a shared bucket if no user
  const store = getProgressStore();
  store[email] = (records && typeof records === 'object') ? records : {};
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(store));
}

/**
 * Checks whether a specific resource is marked completed
 * @param {string} resourceId
 * @returns {boolean}
 */
function isResourceCompleted(resourceId) {
  const records = getProgressRecords();
  return Boolean(records[resourceId]);
}

/**
 * Toggles completion status for a resource
 * @param {string} resourceId
 * @param {string} resourceType - 'PDF' or 'Lecture'
 * @returns {boolean} New completion status
 */
function toggleResourceProgress(resourceId, resourceType = 'PDF') {
  const email = getCurrentUserEmail();
  if (!email) {
    showToast('Please login to track progress', 'info');
    return false;
  }

  const records = getProgressRecords();
  const currentlyDone = Boolean(records[resourceId]);
  const newStatus = !currentlyDone;

  if (newStatus) {
    records[resourceId] = true;
    const msg = resourceType.toLowerCase() === 'pdf' ? 'Marked as Read! Progress updated.' : 'Marked as Completed! Great job!';
    showToast(msg, 'success');
  } else {
    delete records[resourceId];
    showToast('Unmarked as completed', 'info');
  }

  saveProgressRecords(records);
  return newStatus;
}

/**
 * Calculates progress statistics for a given subject
 * @param {string} subjectName
 * @returns {Object} { total, completed, percentage }
 */
function getSubjectProgress(subjectName) {
  const all = getAllResources();
  const records = getProgressRecords();

  const subjectResources = all.filter(r => r.subject.toLowerCase() === subjectName.toLowerCase());
  const total = subjectResources.length;

  if (total === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const completed = subjectResources.filter(r => records[r.id]).length;
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, percentage };
}

/**
 * Calculates overall study progress across all subjects
 * @returns {Object} { total, completed, percentage }
 */
function getOverallProgress() {
  const all = getAllResources();
  const records = getProgressRecords();
  const total = all.length;
  if (total === 0) return { total: 0, completed: 0, percentage: 0 };

  const completed = all.filter(r => records[r.id]).length;
  const percentage = Math.round((completed / total) * 100);
  return { total, completed, percentage };
}
