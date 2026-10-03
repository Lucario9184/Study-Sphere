/**
 * STUDYSPHERE — PROGRESS TRACKING (js/progress.js)
 * Clean, lightweight study completion tracker.
 * Allows students to "Mark as Read" (PDF) or "Mark as Completed" (Lectures),
 * and automatically computes progress percentages for each subject.
 */

/**
 * Returns dictionary of completed resources
 * Structure: { [resourceId]: true }
 * @returns {Object}
 */
function getProgressRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Error reading progress records:", e);
    return {};
  }
}

/**
 * Saves progress records dictionary to localStorage
 * @param {Object} records
 */
function saveProgressRecords(records) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(records));
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
