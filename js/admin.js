/**
 * STUDYSPHERE — ADMIN CONTROLLER (js/admin.js)
 * Manages demo admin resource CRUD operations:
 * - Access role check
 * - Metrics overview (Total Resources, Views, Ratings, Completed)
 * - Add resource modal with validation
 * - Edit resource modal
 * - Delete confirmation modal
 */

let activeEditResourceId = null;
let activeDeleteResourceId = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Guard check: Must be logged in as admin
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    // Show polite warning and offer quick switch to demo admin
    const adminContainer = document.querySelector('.main-content');
    if (adminContainer) {
      adminContainer.innerHTML = `
        <div class="container" style="max-width: 600px; margin-top: 3rem;">
          <div class="empty-state">
            <div class="empty-state-icon">🔒</div>
            <h3>Administrator Access Required</h3>
            <p>You are currently browsing as a <strong>${user ? escapeHtml(user.role) : 'Guest'}</strong>. To access the admin panel, please log in using the demo administrator account.</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary" id="btn-quick-admin-login">Switch to Demo Admin</button>
              <a href="dashboard.html" class="btn btn-secondary">Go to Student Dashboard</a>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-quick-admin-login').addEventListener('click', () => {
        loginUser('admin@studysphere.edu', 'admin123');
        showToast('Switched to Demo Admin account', 'success');
        setTimeout(() => window.location.reload(), 600);
      });
    }
    return;
  }

  // 2. Load metrics and table
  refreshAdminDashboard();

  // 3. Attach modal events
  setupAdminModals();
});

/**
 * Calculates and updates admin analytics and refreshes table
 */
function refreshAdminDashboard() {
  const all = getAllResources();
  const ratings = getAllRatings();
  const progress = getProgressRecords();

  // Total Views
  const totalViews = all.reduce((sum, r) => sum + (r.views || 0), 0);

  // Total Ratings count
  let totalRatingsCount = 0;
  Object.values(ratings).forEach(resRatings => {
    totalRatingsCount += Object.keys(resRatings).length;
  });
  // Fallback to resource aggregate count if ratings store has seed counts
  if (totalRatingsCount === 0) {
    totalRatingsCount = all.reduce((sum, r) => sum + (r.ratingCount || 0), 0);
  }

  // Completed items
  const totalCompleted = Object.keys(progress).length;

  document.getElementById('admin-total-resources').textContent = all.length;
  document.getElementById('admin-total-views').textContent = totalViews;
  document.getElementById('admin-total-ratings').textContent = totalRatingsCount;
  document.getElementById('admin-total-completed').textContent = totalCompleted;

  // Render Table
  renderResourceTable(all);
}

/**
 * Renders the table of resources in the admin panel
 * @param {Array<Object>} resources 
 */
function renderResourceTable(resources) {
  const tableBody = document.getElementById('admin-resources-tbody');
  if (!tableBody) return;

  if (resources.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No resources found. Click "Add New Resource" to create one.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = resources.map(res => {
    const badgeType = res.type.toLowerCase() === 'pdf' ? 'badge-pdf' : 'badge-lecture';
    return `
      <tr>
        <td style="font-weight: 700; color: var(--secondary-color);">
          ${escapeHtml(res.title)}
        </td>
        <td>
          <span style="font-size: 0.85rem; font-weight: 600;">${escapeHtml(res.subject)}</span>
        </td>
        <td>
          <span class="card-badge ${badgeType}">${escapeHtml(res.type)}</span>
        </td>
        <td>
          ⭐ ${(res.rating || 0).toFixed(1)} <span style="font-size: 0.8rem; color: var(--text-light);">(${res.ratingCount || 0})</span>
        </td>
        <td>${res.views || 0}</td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(res.date || 'N/A')}</td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <a href="resource.html?id=${encodeURIComponent(res.id)}" class="btn btn-outline btn-sm" title="View in browser">👁️ View</a>
            <button class="btn btn-secondary btn-sm btn-edit-res" data-id="${escapeHtml(res.id)}" title="Edit resource">✏️ Edit</button>
            <button class="btn btn-danger btn-sm btn-delete-res" data-id="${escapeHtml(res.id)}" title="Delete resource">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Attach Edit and Delete buttons
  tableBody.querySelectorAll('.btn-edit-res').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openEditModal(id);
    });
  });

  tableBody.querySelectorAll('.btn-delete-res').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openDeleteModal(id);
    });
  });
}

/**
 * Sets up modals for Add, Edit, and Delete actions
 */
function setupAdminModals() {
  const addModal = document.getElementById('modal-add-resource');
  const editModal = document.getElementById('modal-edit-resource');
  const deleteModal = document.getElementById('modal-delete-confirm');

  // Open Add Modal button
  const openAddBtn = document.getElementById('btn-open-add-modal');
  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      document.getElementById('form-add-resource').reset();
      document.getElementById('add-date').value = new Date().toISOString().split('T')[0];
      addModal.classList.add('active');
    });
  }

  // Close buttons on all modals
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      addModal.classList.remove('active');
      editModal.classList.remove('active');
      deleteModal.classList.remove('active');
    });
  });

  // Close on clicking overlay background
  [addModal, editModal, deleteModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Handle Add Resource Form Submit
  const addForm = document.getElementById('form-add-resource');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAddResource();
    });
  }

  // Handle Edit Resource Form Submit
  const editForm = document.getElementById('form-edit-resource');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSaveEditResource();
    });
  }

  // Handle Confirm Delete Button
  const confirmDeleteBtn = document.getElementById('btn-confirm-delete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      handleConfirmDelete();
    });
  }

  // Admin Search Filter in Table
  const tableSearch = document.getElementById('admin-table-search');
  if (tableSearch) {
    tableSearch.addEventListener('input', () => {
      const q = tableSearch.value.toLowerCase().trim();
      const all = getAllResources();
      const filtered = all.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.subject.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
      renderResourceTable(filtered);
    });
  }
}

/**
 * Adds a new resource to localStorage
 */
function handleAddResource() {
  const title = document.getElementById('add-title').value.trim();
  const subject = document.getElementById('add-subject').value;
  const unit = document.getElementById('add-unit').value.trim();
  const type = document.getElementById('add-type').value;
  const desc = document.getElementById('add-description').value.trim();
  const tagsStr = document.getElementById('add-tags').value.trim();
  const linkInput = document.getElementById('add-link').value.trim();
  const fileInput = document.getElementById('add-file');
  const dateVal = document.getElementById('add-date').value || new Date().toISOString().split('T')[0];

  if (!title || !subject || !unit || !desc) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Determine link or file
  let finalLink = linkInput;
  if (type === 'PDF' && fileInput.files && fileInput.files[0]) {
    // Demo notice: local file reference
    finalLink = "files/sample.pdf"; // Default fallback sample PDF for demo reliability
  } else if (!finalLink) {
    finalLink = type === 'PDF' ? 'files/sample.pdf' : 'https://www.youtube.com/embed/1vtzmZ9XN4U';
  }

  // Parse tags
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [subject.toLowerCase()];

  const newResource = {
    id: `res_custom_${Date.now()}`,
    title: title,
    subject: subject,
    unit: unit,
    type: type,
    description: desc,
    link: finalLink,
    date: dateVal,
    rating: 5.0,
    ratingCount: 1,
    views: 0,
    tags: tags
  };

  const all = getAllResources();
  all.unshift(newResource);
  saveAllResources(all);

  document.getElementById('modal-add-resource').classList.remove('active');
  showToast(`Resource "${title}" created successfully!`, 'success');
  refreshAdminDashboard();
}

/**
 * Opens edit modal populated with existing data
 * @param {string} id 
 */
function openEditModal(id) {
  const res = getResourceById(id);
  if (!res) {
    showToast('Resource not found', 'error');
    return;
  }

  activeEditResourceId = id;

  document.getElementById('edit-title').value = res.title;
  document.getElementById('edit-subject').value = res.subject;
  document.getElementById('edit-unit').value = res.unit;
  document.getElementById('edit-type').value = res.type;
  document.getElementById('edit-description').value = res.description;
  document.getElementById('edit-tags').value = Array.isArray(res.tags) ? res.tags.join(', ') : '';
  document.getElementById('edit-link').value = res.link;

  document.getElementById('modal-edit-resource').classList.add('active');
}

/**
 * Saves edited resource back to localStorage
 */
function handleSaveEditResource() {
  if (!activeEditResourceId) return;

  const all = getAllResources();
  const res = all.find(r => r.id === activeEditResourceId);
  if (!res) {
    showToast('Resource no longer exists', 'error');
    return;
  }

  res.title = document.getElementById('edit-title').value.trim();
  res.subject = document.getElementById('edit-subject').value;
  res.unit = document.getElementById('edit-unit').value.trim();
  res.type = document.getElementById('edit-type').value;
  res.description = document.getElementById('edit-description').value.trim();
  res.link = document.getElementById('edit-link').value.trim() || res.link;

  const tagsStr = document.getElementById('edit-tags').value.trim();
  res.tags = tagsStr ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : res.tags;

  saveAllResources(all);

  document.getElementById('modal-edit-resource').classList.remove('active');
  showToast(`Updated "${res.title}"`, 'success');
  refreshAdminDashboard();
}

/**
 * Opens deletion confirmation modal
 * @param {string} id 
 */
function openDeleteModal(id) {
  const res = getResourceById(id);
  if (!res) return;

  activeDeleteResourceId = id;
  document.getElementById('delete-resource-title-confirm').textContent = res.title;
  document.getElementById('modal-delete-confirm').classList.add('active');
}

/**
 * Confirms deletion of active resource
 */
function handleConfirmDelete() {
  if (!activeDeleteResourceId) return;

  let all = getAllResources();
  const target = all.find(r => r.id === activeDeleteResourceId);
  const deletedTitle = target ? target.title : 'Resource';

  all = all.filter(r => r.id !== activeDeleteResourceId);
  saveAllResources(all);

  // Also clean up any bookmarks
  let bookmarks = getBookmarkedIds();
  bookmarks = bookmarks.filter(id => id !== activeDeleteResourceId);
  saveBookmarkedIds(bookmarks);

  document.getElementById('modal-delete-confirm').classList.remove('active');
  showToast(`Deleted "${deletedTitle}"`, 'info');
  refreshAdminDashboard();
}
