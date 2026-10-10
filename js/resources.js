/**
 * STUDYSPHERE — RESOURCE ENGINE & DATA STORE (js/resources.js)
 * Manages study resources: initial seed data, localStorage synchronization,
 * search algorithms, multi-criteria filtering, and reusable card rendering.
 */

// --- 1. DEFAULT SEED DATASET ---
// Realistic first-year college curriculum resources
const DEFAULT_RESOURCES = [
  // --- Engineering Physics ---
  {
    id: "res_phy_1",
    title: "Introduction to Quantum Physics",
    subject: "Engineering Physics",
    unit: "Unit 1: Quantum Mechanics",
    type: "PDF",
    description: "Foundational notes on Planck's quantum theory, wave-particle duality, de Broglie wavelength, and the uncertainty principle.",
    link: "files/sample.pdf",
    date: "2026-09-10",
    rating: 4.8,
    ratingCount: 38,
    views: 142,
    tags: ["quantum", "physics", "planck", "de broglie", "wave theory"]
  },
  {
    id: "res_phy_2",
    title: "Photoelectric Effect Notes & Formulas",
    subject: "Engineering Physics",
    unit: "Unit 1: Quantum Mechanics",
    type: "PDF",
    description: "Detailed derivations of Einstein's photoelectric equation, threshold frequency, stopping potential, and solved numerical problems.",
    link: "files/sample.pdf",
    date: "2026-09-14",
    rating: 4.7,
    ratingCount: 29,
    views: 110,
    tags: ["photoelectric", "einstein", "physics", "stopping potential"]
  },
  {
    id: "res_phy_3",
    title: "Compton Effect & X-Ray Scattering Lecture",
    subject: "Engineering Physics",
    unit: "Unit 2: Wave Optics & Modern Physics",
    type: "Lecture",
    description: "Visual lecture breakdown explaining Compton shift, photon-electron collision geometry, and experimental verification.",
    link: "https://www.youtube.com/embed/9ydE9e6jFwA",
    date: "2026-09-18",
    rating: 4.6,
    ratingCount: 22,
    views: 89,
    tags: ["compton", "xray", "scattering", "physics", "lecture"]
  },

  // --- Engineering Mathematics ---
  {
    id: "res_mat_1",
    title: "Matrices & System of Linear Equations",
    subject: "Engineering Mathematics",
    unit: "Unit 1: Linear Algebra",
    type: "PDF",
    description: "Comprehensive notes covering matrix rank, echelon form, Gauss-Jordan elimination, and consistency of linear systems.",
    link: "files/sample.pdf",
    date: "2026-09-08",
    rating: 4.9,
    ratingCount: 45,
    views: 195,
    tags: ["matrices", "linear algebra", "rank", "math", "equations"]
  },
  {
    id: "res_mat_2",
    title: "Eigenvalues & Eigenvectors Video Masterclass",
    subject: "Engineering Mathematics",
    unit: "Unit 1: Linear Algebra",
    type: "Lecture",
    description: "Step-by-step video tutorial on characteristic equations, finding eigenvectors, and Cayley-Hamilton theorem applications.",
    link: "https://www.youtube.com/embed/PFDu9oVAE-g",
    date: "2026-09-15",
    rating: 4.8,
    ratingCount: 34,
    views: 160,
    tags: ["eigenvalues", "eigenvectors", "cayley-hamilton", "math", "lecture"]
  },
  {
    id: "res_mat_3",
    title: "First-Order Differential Equations Handout",
    subject: "Engineering Mathematics",
    unit: "Unit 3: Calculus & Differential Equations",
    type: "PDF",
    description: "Formulas and practice questions for exact differential equations, integrating factors, and Newton's law of cooling.",
    link: "files/sample.pdf",
    date: "2026-09-20",
    rating: 4.5,
    ratingCount: 19,
    views: 78,
    tags: ["differential equations", "calculus", "integrating factor", "math"]
  },

  // --- Programming / C ---
  {
    id: "res_prg_1",
    title: "C Programming Basics & Syntax Guide",
    subject: "Programming / C",
    unit: "Unit 1: Foundations of C",
    type: "PDF",
    description: "Quick reference for variables, data types, tokens, printf/scanf formatting, operators, and basic compilation commands.",
    link: "files/sample.pdf",
    date: "2026-09-05",
    rating: 4.8,
    ratingCount: 52,
    views: 230,
    tags: ["c", "programming", "basics", "syntax", "compilation"]
  },
  {
    id: "res_prg_2",
    title: "Loops & Conditional Statements Lecture",
    subject: "Programming / C",
    unit: "Unit 2: Control Flow",
    type: "Lecture",
    description: "Live coding demonstration of if-else ladders, switch cases, for loops, while loops, and break/continue statements.",
    link: "https://www.youtube.com/embed/KJgsSFOSQv0",
    date: "2026-09-12",
    rating: 4.7,
    ratingCount: 40,
    views: 205,
    tags: ["loops", "conditionals", "c", "programming", "control flow"]
  },
  {
    id: "res_prg_3",
    title: "Arrays, Strings & Functions Handout",
    subject: "Programming / C",
    unit: "Unit 3: Modular Programming",
    type: "PDF",
    description: "Detailed notes explaining 1D and 2D arrays, string manipulation functions, parameter passing, and recursion with diagrammatic stack frames.",
    link: "files/sample.pdf",
    date: "2026-09-22",
    rating: 4.9,
    ratingCount: 36,
    views: 180,
    tags: ["arrays", "strings", "functions", "recursion", "c"]
  },

  // --- Electrical Engineering ---
  {
    id: "res_ee_1",
    title: "Network Theorems (Thevenin & Norton) Guide",
    subject: "Electrical Engineering",
    unit: "Unit 2: Network Analysis",
    type: "PDF",
    description: "Step-by-step analysis and circuit reduction methods using Thevenin, Norton, Superposition, and Maximum Power Transfer theorems.",
    link: "files/sample.pdf",
    date: "2026-09-11",
    rating: 4.6,
    ratingCount: 26,
    views: 94,
    tags: ["circuits", "thevenin", "norton", "electrical", "theorems"]
  },
  {
    id: "res_ee_2",
    title: "Kirchhoff's Laws (KVL & KCL) Explained",
    subject: "Electrical Engineering",
    unit: "Unit 1: DC Circuit Analysis",
    type: "Lecture",
    description: "Intuitive video explanation of Kirchhoff's Current Law (junction rule) and Voltage Law (loop rule) with circuit node analysis.",
    link: "https://www.youtube.com/embed/1vtzmZ9XN4U",
    date: "2026-09-16",
    rating: 4.8,
    ratingCount: 31,
    views: 140,
    tags: ["kirchhoff", "kvl", "kcl", "circuits", "electrical", "lecture"]
  },
  {
    id: "res_ee_3",
    title: "Mesh & Nodal Analysis Problem Sheets",
    subject: "Electrical Engineering",
    unit: "Unit 1: DC Circuit Analysis",
    type: "PDF",
    description: "Curated collection of 15 practice problems with full step-by-step matrix solutions for multi-loop DC electrical networks.",
    link: "files/sample.pdf",
    date: "2026-09-25",
    rating: 4.5,
    ratingCount: 18,
    views: 72,
    tags: ["mesh analysis", "nodal analysis", "electrical", "circuits", "problems"]
  },

  // --- Engineering Chemistry ---
  {
    id: "res_ch_1",
    title: "Chemical Bonding & Molecular Orbitals",
    subject: "Engineering Chemistry",
    unit: "Unit 1: Atomic & Molecular Structure",
    type: "PDF",
    description: "Notes on Valence Bond Theory, Molecular Orbital Theory, bond order calculations, and crystal field splitting in coordination complexes.",
    link: "files/sample.pdf",
    date: "2026-09-09",
    rating: 4.4,
    ratingCount: 20,
    views: 85,
    tags: ["bonding", "molecular orbital", "chemistry", "mot"]
  },
  {
    id: "res_ch_2",
    title: "Thermodynamics & Phase Rule Notes",
    subject: "Engineering Chemistry",
    unit: "Unit 3: Chemical Thermodynamics",
    type: "PDF",
    description: "In-depth summary of entropy, Gibbs free energy, Clausius-Clapeyron equation, and single-component water phase diagrams.",
    link: "files/sample.pdf",
    date: "2026-09-17",
    rating: 4.7,
    ratingCount: 27,
    views: 104,
    tags: ["thermodynamics", "entropy", "gibbs", "chemistry", "phase rule"]
  },
  {
    id: "res_ch_3",
    title: "Electrochemistry & Corrosion Engineering",
    subject: "Engineering Chemistry",
    unit: "Unit 4: Electrochemistry",
    type: "Lecture",
    description: "Educational video exploring standard electrode potential, Nernst equation, corrosion mechanisms, and sacrificial anode cathodic protection.",
    link: "https://www.youtube.com/embed/jZ_y-K0_HlY",
    date: "2026-09-24",
    rating: 4.6,
    ratingCount: 23,
    views: 92,
    tags: ["electrochemistry", "corrosion", "nernst", "chemistry", "lecture"]
  }
];

// --- 2. STORAGE INITIALIZATION & ACCESS ---
/**
 * Ensures initial default resources are stored in localStorage
 */
function initResourcesStorage() {
  const existing = localStorage.getItem(STORAGE_KEYS.RESOURCES);
  if (!existing) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(DEFAULT_RESOURCES));
  }
}

/**
 * Returns all resources from localStorage
 * @returns {Array<Object>}
 */
function getAllResources() {
  initResourcesStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return data ? JSON.parse(data) : DEFAULT_RESOURCES;
  } catch (err) {
    console.error("Error loading resources from localStorage:", err);
    return DEFAULT_RESOURCES;
  }
}

/**
 * Overwrites the resources array in localStorage
 * @param {Array<Object>} resourcesList
 */
function saveAllResources(resourcesList) {
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resourcesList));
}

/**
 * Finds a single resource by its ID
 * @param {string} id
 * @returns {Object|null}
 */
function getResourceById(id) {
  const all = getAllResources();
  return all.find(r => r.id === id) || null;
}

/**
 * Loads recently viewed dictionary from localStorage and migrates if needed
 * @returns {Object} { [userEmail]: Array<{id: string, viewedAt: string}> }
 */
function getRecentlyViewedStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Old global format: array of items. Migrate to current user bucket.
      const email = getCurrentUserEmail();
      if (email) {
        const migrated = { [email]: parsed };
        localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(migrated));
        return migrated;
      }
      return {};
    }
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return {};
  } catch (e) {
    console.error("Error reading recently viewed store:", e);
    return {};
  }
}

/**
 * Fetches recently viewed array for the current user
 * @returns {Array<{id: string, viewedAt: string}>}
 */
function getRecentlyViewedItems() {
  const email = getCurrentUserEmail();
  if (!email) return [];
  const store = getRecentlyViewedStore();
  const userRecent = store[email];
  return Array.isArray(userRecent) ? userRecent : [];
}

/**
 * Saves recently viewed array for the current user
 * @param {Array<{id: string, viewedAt: string}>} items
 */
function saveRecentlyViewedItems(items) {
  const email = getCurrentUserEmail();
  if (!email) return; // never write to a shared bucket if no user
  const store = getRecentlyViewedStore();
  store[email] = Array.isArray(items) ? items : [];
  localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(store));
}

/**
 * Increments the view count of a resource and records view date
 * @param {string} id
 */
function trackResourceView(id) {
  const all = getAllResources();
  const res = all.find(r => r.id === id);
  if (res) {
    res.views = (res.views || 0) + 1;
    saveAllResources(all);
  }

  // Also add to recently viewed list (max 5 items) for current user
  const email = getCurrentUserEmail();
  if (!email) return;

  try {
    let recent = getRecentlyViewedItems();
    // Remove if already in list to put it at the very top
    recent = recent.filter(item => item.id !== id);
    recent.unshift({
      id: id,
      viewedAt: new Date().toISOString()
    });
    // Limit to latest 5 items
    if (recent.length > 5) {
      recent = recent.slice(0, 5);
    }
    saveRecentlyViewedItems(recent);
  } catch (e) {
    console.warn("Could not record recently viewed item:", e);
  }
}

// --- 3. SEARCH & FILTERING FUNCTIONS ---
/**
 * Searches and filters resources based on user inputs
 * @param {Object} criteria
 * @param {string} criteria.query - Free text query
 * @param {string} criteria.subject - Subject filter or 'All'
 * @param {string} criteria.type - 'All', 'PDF', or 'Lecture'
 * @param {number} criteria.minRating - Minimum rating filter (0, 3, 4)
 * @param {string} criteria.sortBy - 'newest', 'rating', 'popular'
 * @returns {Array<Object>}
 */
function filterResources({ query = '', subject = 'All', type = 'All', minRating = 0, sortBy = 'rating' }) {
  const all = getAllResources();
  const cleanQuery = query.trim().toLowerCase();

  const filtered = all.filter(item => {
    // 1. Text Search across Title, Subject, Unit, Tags, and Description
    if (cleanQuery) {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchSubject = item.subject.toLowerCase().includes(cleanQuery);
      const matchUnit = item.unit.toLowerCase().includes(cleanQuery);
      const matchDesc = item.description.toLowerCase().includes(cleanQuery);
      const matchTags = Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(cleanQuery));

      if (!matchTitle && !matchSubject && !matchUnit && !matchDesc && !matchTags) {
        return false;
      }
    }

    // 2. Subject filter
    if (subject && subject !== 'All') {
      if (item.subject.toLowerCase() !== subject.toLowerCase()) {
        return false;
      }
    }

    // 3. Type filter (PDF vs Lecture)
    if (type && type !== 'All') {
      if (item.type.toLowerCase() !== type.toLowerCase()) {
        return false;
      }
    }

    // 4. Rating filter (3+, 4+)
    if (minRating > 0) {
      if ((item.rating || 0) < minRating) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'popular') {
      return (b.views || 0) - (a.views || 0);
    }
    // Default: simple weighted score (average rating + log of rating count)
    // Formula: score = rating * log10(ratingCount + 1)
    // This rewards high ratings while giving credit to items with many ratings.
    const scoreA = (a.rating || 0) * Math.log10((a.ratingCount || 1) + 1);
    const scoreB = (b.rating || 0) * Math.log10((b.ratingCount || 1) + 1);
    return scoreB - scoreA;
  });

  return filtered;
}

// --- 4. REUSABLE CARD RENDERING ---
/**
 * Checks if a resource is bookmarked by the current user
 * @param {string} resourceId
 * @returns {boolean}
 */
function isResourceBookmarked(resourceId) {
  if (typeof getBookmarkedIds === 'function') {
    return getBookmarkedIds().includes(resourceId);
  }
  return false;
}

/**
 * Creates HTML string for a reusable resource card
 * @param {Object} res - Resource object
 * @returns {string} HTML string
 */
function renderResourceCardHtml(res) {
  const isBookmarked = isResourceBookmarked(res.id);
  const badgeClass = res.type.toLowerCase() === 'pdf' ? 'badge-pdf' : 'badge-lecture';
  const typeIcon = res.type.toLowerCase() === 'pdf' ? '📄' : '🎥';
  const bookmarkIcon = isBookmarked ? '★' : '☆';

  return `
    <article class="resource-card" data-id="${res.id}">
      <div class="card-top">
        <span class="card-badge ${badgeClass}">${typeIcon} ${escapeHtml(res.type)}</span>
        <button class="card-bookmark-btn ${isBookmarked ? 'active' : ''}" 
                data-id="${res.id}" 
                title="${isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}"
                aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}">
          ${bookmarkIcon}
        </button>
      </div>

      <h3 class="card-title">
        <a href="resource.html?id=${res.id}">${escapeHtml(res.title)}</a>
      </h3>

      <div class="card-meta">
        <span>📚 ${escapeHtml(res.subject)}</span>
        <span>•</span>
        <span>${escapeHtml(res.unit.split(':')[0])}</span>
      </div>

      <p class="card-desc">${escapeHtml(res.description)}</p>

      <div class="card-rating-row">
        <div class="rating-stars">
          ⭐ <span>${(res.rating || 0).toFixed(1)}</span>
          <span class="rating-count">(${res.ratingCount || 0} ratings)</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-light);">
          👁️ ${res.views || 0} views
        </div>
      </div>

      <div class="card-actions">
        <a href="resource.html?id=${res.id}" class="btn btn-primary btn-sm">
          Open Resource
        </a>
      </div>
    </article>
  `;
}

/**
 * Attaches bookmark click listeners to rendered cards inside a container
 * @param {HTMLElement} container
 */
function attachCardBookmarkListeners(container) {
  if (!container) return;
  const buttons = container.querySelectorAll('.card-bookmark-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleBookmark(id, () => {
        // Toggle active visual state
        const bookmarked = isResourceBookmarked(id);
        btn.classList.toggle('active', bookmarked);
        btn.innerHTML = bookmarked ? '★' : '☆';
        btn.title = bookmarked ? 'Remove bookmark' : 'Bookmark resource';
      });
    });
  });
}

// Auto-seed storage on script load
initResourcesStorage();
