# 🎓 StudySphere — Learn. Explore. Grow.

> **A polished, practical study-resource platform built by a 5-member team of 1st year college students for a college hackathon project.**

---

## 📌 Project Overview

**StudySphere** is a centralized academic study-resource website tailored for first-year college engineering students. It allows students to browse verified syllabus notes, open inline PDF handouts, watch curated video lectures, rate materials, bookmark resources for exams, track subject completion progress, and interact with an offline AI study assistant.

> **Hackathon Prototype Notice:**  
> StudySphere is a frontend-only educational platform prototype created by a 5-member team of 1st year college students using **HTML5, CSS3, and Vanilla JavaScript**. It requires zero external backends, no cloud databases, and no API keys. All state is maintained locally in the browser using the Web Storage API (`localStorage`).

---

## 🚀 Key Features

1. **Academic Resource Library**:
   - Curated materials across 5 core courses: **Engineering Physics**, **Engineering Mathematics**, **Electrical Engineering**, **Programming / C**, and **Engineering Chemistry**.
   - Dual format: In-browser **PDF Notes viewer** and embedded **Video Lectures**.
2. **Real-Time Search & Multi-Criteria Filtering**:
   - Instant search matching resource titles, subjects, units, descriptions, and tags.
   - Filter by course, media type (PDF vs. Lecture), and star rating (3+, 4+).
   - Dynamic sorting by highest rated, most viewed, or newest.
3. **Interactive 1-to-5 Star Rating System**:
   - Calculates weighted average scores and total review counts.
   - Prevents duplicate votes from the same demo user while allowing rating adjustments.
4. **My Bookmarks**:
   - One-click bookmarking of handouts and lectures with persistence across browser refreshes.
5. **Study Progress Tracker**:
   - Mark notes as "Read" or lectures as "Completed".
   - Visual progress bars dynamically computing completion percentage per academic subject.
6. **Continue Learning (Recently Viewed)**:
   - Tracks the latest 5 opened study resources on the student dashboard.
7. **Study AI 🤖 Assistant**:
   - Concept explainer answering first-year college questions (Photoelectric effect, Matrices, Kirchhoff's laws, C pointers, Thermodynamics, etc.) using semantic keyword extraction without external API dependencies.
8. **Demo Administrator Control Console**:
   - Faculty/Admin mode to view platform metrics (total views, ratings, resources).
   - Full CRUD capability: Add new resources (with local file/URL), edit existing metadata, and delete resources with confirmation prompts.
9. **Responsive & Accessible Design**:
   - Adapts to mobile phones, tablets, and desktop displays with smooth navigation and clean cards.

---

## 🛠️ Technology Stack

Strictly compliant with hackathon beginner development rules:

- **HTML5**: Semantic document layout (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3**: Custom design system using CSS variables, Flexbox, CSS Grid, animations, and media queries (`css/style.css` and `css/responsive.css`). Zero CSS frameworks.
- **Vanilla JavaScript (ES6+)**: Pure DOM manipulation, array filtering/sorting algorithms, and event handling. No external JS libraries.
- **Browser Storage**: `localStorage` for all state persistence.

---

## 📂 Project Directory Structure

```
StudySphere/
├── index.html            # Landing homepage: hero, popular resources, subject cards, stats
├── login.html            # Demo authentication: student and admin login/register
├── dashboard.html        # Personalized student dashboard: progress bars, recent views, bookmarks
├── subjects.html         # Curriculum catalog with resource count badges & preview topics
├── resources.html        # Main resource library with live search, filters, and dynamic cards
├── resource.html         # Single resource viewer (responsive PDF iframe, YouTube player, rating widget)
├── bookmarks.html        # Saved student bookmarks page with one-click removal
├── study-ai.html         # Offline Study AI chat assistant with suggested topic chips
├── admin.html            # Demo faculty/admin console with metrics, table & Add/Edit/Delete modals
│
├── css/
│   ├── style.css         # Academic design system: variables, cards, buttons, modals, toasts
│   └── responsive.css    # Media queries for tablet, mobile drawer menu, and fluid embeds
│
├── js/
│   ├── app.js            # Global utilities, navigation setup, session badge, toast system
│   ├── auth.js           # Demo login/register logic and default user profiles
│   ├── resources.js      # Seed dataset, search/filter logic, card HTML renderer
│   ├── dashboard.js      # Dashboard counters, recent 5 items, subject progress calculation
│   ├── bookmarks.js      # Bookmark state manager and bookmarks page renderer
│   ├── ratings.js        # 1-5 star ratings formula, user vote tracking, star widget
│   ├── progress.js       # Mark complete/read logic and subject completion percentage
│   ├── admin.js          # Admin CRUD actions, modals, and metric aggregations
│   └── study-ai.js       # Concept matcher, simulated typing indicator, academic knowledge base
│
├── files/
│   └── sample.pdf        # Standard sample academic notes PDF for direct iframe viewing
│
└── README.md             # Project documentation and hackathon code walkthrough guide
```

---

## 🏃 How to Run the Project

Since StudySphere is built with pure web standards, no build tools, npm packages, or compilers are required.

### Method 1: Direct File Opening

1. Double-click `index.html` in your file explorer or open it directly in Google Chrome, Safari, Firefox, or Edge.

### Method 2: Local Python Server (Recommended for iframes)

If you prefer running via a local web server:

```bash
# From the project root directory
python3 -m http.server 8000
```

Then navigate to:

```
http://localhost:8000
```

---

## 🔑 Demo Login Accounts

Pre-configured demo credentials are provided on `login.html` with **1-click quick-fill buttons**:

| Account Type     | Email                   | Password     | Access Level                                    |
| :--------------- | :---------------------- | :----------- | :---------------------------------------------- |
| **Demo Student** | `student@example.com`   | `student123` | Student Dashboard, Bookmarks, Ratings, Progress |
| **Demo Admin**   | `admin@studysphere.edu` | `admin123`   | Full Access + Admin Console (Add, Edit, Delete) |

---

## 💾 How `localStorage` is Used

All platform state persists under specific namespaces:

1. `studysphere_resources`: Array of all resource objects (seed materials + admin additions).
2. `studysphere_current_user`: Active logged-in session object `{ name, email, role }`.
3. `studysphere_users`: List of registered demo user profiles.
4. `studysphere_bookmarks`: Array of bookmarked resource IDs `['res_phy_1', 'res_mat_1']`.
5. `studysphere_ratings`: Nested dictionary mapping resource IDs to user ratings:
   ```json
   {
     "res_phy_1": {
       "student@example.com": 5
     }
   }
   ```
6. `studysphere_progress`: Object storing completed resource IDs `{ "res_phy_1": true }`.
7. `studysphere_recent`: Array of the latest 5 viewed resource IDs with timestamps.

---

## 🎤 Hackathon Code Walkthrough Guide (Viva Script)

When explaining the code to judges, refer to these straightforward workflows:

- **Search & Multi-Filtering (`js/resources.js` -> `filterResources()`):**  
  _Takes user search text and dropdown selections, filters the resource array across title, subject, unit, and tags, applies sort orders, and generates cards dynamically._
- **Bookmark System (`js/bookmarks.js` -> `toggleBookmark()`):**  
  _Reads bookmark array from `localStorage`, checks for existence, pushes or splices the ID, updates the UI, and displays an informative toast notification._
- **Star Ratings (`js/ratings.js` -> `submitRating()`):**  
  _Records the rating under the user's key in a nested object, computes the new mathematical mean, updates the resource count, and synchronizes the card._
- **Subject Progress Calculation (`js/progress.js` -> `getSubjectProgress()`):**  
  _Compares the total number of resources in a subject against the count of marked completions in `localStorage` to compute an exact percentage `(completed / total) _ 100`.\*
- **Study AI (`js/study-ai.js` -> `findBestResponse()`):**  
  _Extracts keywords from the student's prompt, matches them against a curated academic knowledge base, and renders a structured explanation with a simulated typing delay._

---

## ⚠️ Prototype Limitations

- **No Backend Server**: Data is isolated to the user's current browser and device.
- **Demo Authentication**: Passwords and sessions are held in `localStorage` for demonstration purposes and are not encrypted for production security.
- **File Uploads**: Admin uploaded files reference local browser assets rather than a cloud storage bucket.

---

## 🔮 Future Enhancements

- Integration with a production backend (Node.js/Express or Python/FastAPI) and PostgreSQL database.
- JWT authentication with encrypted passwords and college single sign-on (SSO).
- Cloud object storage (AWS S3 or Google Cloud Storage) for user-uploaded study notes.
- Real-time student study groups and collaborative annotation on PDF notes.
- Live LLM integration for the Study AI assistant with context awareness of uploaded notes.

---

## 📄 License

Created for educational and hackathon demonstration purposes. Free to use and explore.
