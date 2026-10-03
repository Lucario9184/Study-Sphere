/**
 * STUDYSPHERE — RATING SYSTEM (js/ratings.js)
 * Clean, beginner-friendly 1-5 star rating persistence.
 * Uses a simple nested object structure in localStorage:
 * ratings = {
 *   resourceId: {
 *     userId: 5
 *   }
 * }
 */

/**
 * Loads all ratings from localStorage
 * @returns {Object}
 */
function getAllRatings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RATINGS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Error reading ratings:", e);
    return {};
  }
}

/**
 * Saves ratings dictionary to localStorage
 * @param {Object} ratings
 */
function saveAllRatings(ratings) {
  localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
}

/**
 * Gets the current active user ID (or fallback guest ID)
 * @returns {string}
 */
function getActiveUserId() {
  const user = getCurrentUser();
  return user ? user.email : 'guest_student';
}

/**
 * Gets user's previous rating for this resource if any
 * @param {string} resourceId
 * @returns {number|null} 1-5 or null
 */
function getUserRating(resourceId) {
  const ratings = getAllRatings();
  const userId = getActiveUserId();
  if (ratings[resourceId] && ratings[resourceId][userId]) {
    return ratings[resourceId][userId];
  }
  return null;
}

/**
 * Submits or updates a rating for a resource
 * @param {string} resourceId
 * @param {number} starScore (1 to 5)
 * @returns {Object} { newAverage, newCount, userRating }
 */
function submitRating(resourceId, starScore) {
  if (starScore < 1 || starScore > 5) return null;

  const ratings = getAllRatings();
  const userId = getActiveUserId();

  if (!ratings[resourceId]) {
    ratings[resourceId] = {};
  }

  const isUpdate = Boolean(ratings[resourceId][userId]);
  ratings[resourceId][userId] = starScore;
  saveAllRatings(ratings);

  // Recalculate average and total count for this resource
  const resourceRatings = ratings[resourceId];
  const userScores = Object.values(resourceRatings);
  const totalCount = userScores.length;
  const sumScores = userScores.reduce((acc, score) => acc + score, 0);
  const calculatedAverage = totalCount > 0 ? (sumScores / totalCount) : starScore;

  // Round to 1 decimal place
  const roundedAverage = Math.round(calculatedAverage * 10) / 10;

  // Update resource in studysphere_resources list
  const allResources = getAllResources();
  const targetResource = allResources.find(r => r.id === resourceId);
  if (targetResource) {
    targetResource.rating = roundedAverage;
    targetResource.ratingCount = totalCount;
    saveAllResources(allResources);
  }

  showToast(isUpdate ? 'Your rating has been updated!' : 'Thank you for rating this resource!', 'success');

  return {
    newAverage: roundedAverage,
    newCount: totalCount,
    userRating: starScore
  };
}

/**
 * Initializes interactive stars inside a container on resource.html
 * @param {HTMLElement} starsContainer - Container with .star-interactive elements
 * @param {string} resourceId
 * @param {Function} onRatingChanged - Callback receiving updated stats
 */
function setupRatingWidget(starsContainer, resourceId, onRatingChanged) {
  if (!starsContainer) return;

  const stars = starsContainer.querySelectorAll('.star-interactive');
  const existingScore = getUserRating(resourceId);

  // Highlight initial score if already rated
  if (existingScore) {
    renderStarsActive(stars, existingScore);
  }

  stars.forEach((star, index) => {
    const starValue = index + 1;

    // Hover effect
    star.addEventListener('mouseenter', () => {
      renderStarsActive(stars, starValue);
    });

    // Mouse leave restores saved rating
    star.addEventListener('mouseleave', () => {
      const currentSaved = getUserRating(resourceId);
      renderStarsActive(stars, currentSaved || 0);
    });

    // Click to rate
    star.addEventListener('click', () => {
      const result = submitRating(resourceId, starValue);
      if (result && typeof onRatingChanged === 'function') {
        onRatingChanged(result);
      }
    });
  });
}

function renderStarsActive(starsNodeList, score) {
  starsNodeList.forEach((s, idx) => {
    if (idx < score) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
}
