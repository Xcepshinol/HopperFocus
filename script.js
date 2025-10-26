// ----- Sample data: replace with your real data source -----
const leaderboardData = [
    { name: "Alice", minutes: 608 },   // 10h 08m
    { name: "Bob", minutes: 355 },
    { name: "Charlie", minutes: 221 },
    { name: "Diana", minutes: 702 },
    { name: "Eve", minutes: 115 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Frank", minutes: 490 },
    { name: "Grace", minutes: 61 }
];

// Utility: format minutes as "##H ##M"
function formatHM(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${hh}H ${mm}M`;
}

// Create a row element
function makeRow(rank, name, minutes) {
    const row = document.createElement("div");
    row.className = "lb-row";

    const r = document.createElement("div");
    r.className = "lb-rank";
    r.textContent = rank;

    const n = document.createElement("div");
    n.className = "lb-name";
    n.textContent = name;

    const v = document.createElement("div");
    v.className = "lb-value";
    v.textContent = formatHM(minutes);

    row.appendChild(r);
    row.appendChild(n);
    row.appendChild(v);
    return row;
}

/**
 * Renders the leaderboard with best pinned at top, worst pinned at bottom,
 * and the middle list scrollable.
 * @param {Array<{name:string, minutes:number}>} data
 */
function renderLeaderboard(data) {
    const topEl = document.getElementById("lb-top");
    const scrollEl = document.getElementById("lb-scroll");
    const bottomEl = document.getElementById("lb-bottom");

    if (!topEl || !scrollEl || !bottomEl) return;

  // Clear previous
    topEl.innerHTML = "";
    scrollEl.innerHTML = "";
    bottomEl.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
        scrollEl.textContent = "No data yet.";
        return;
    }

    // Sort by minutes descending (best = highest)
    const sorted = [...data].sort((a, b) => a.minutes - b.minutes);

    // If only 1 entry: pin as top, no bottom
    if (sorted.length === 1) {
        topEl.appendChild(makeRow(1, sorted[0].name, sorted[0].minutes));
        return;
    }

  // If only 2 entries: best top, worst bottom, no middle
    if (sorted.length === 2) {
        topEl.appendChild(makeRow(1, sorted[0].name, sorted[0].minutes));
        bottomEl.appendChild(makeRow(2, sorted[1].name, sorted[1].minutes));
        return;
    }

  // 3+ entries: best top, worst bottom, rest scroll
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    const middle = sorted.slice(1, -1);

    topEl.appendChild(makeRow(1, best.name, best.minutes));

    middle.forEach((person, idx) => {
    // Rank is 2..(n-1)
    const rank = idx + 2;
    scrollEl.appendChild(makeRow(rank, person.name, person.minutes));
  });

    bottomEl.appendChild(makeRow(sorted.length, worst.name, worst.minutes));
}

document.addEventListener("DOMContentLoaded", () => {
    renderLeaderboard(leaderboardData);
});



// ---------- SELECTORS ----------
const lbCard = document.querySelector('.Leaderboard');       // the small card you click
const lbModal = document.getElementById('lb-modal');
const lbBackdrop = document.getElementById('lb-backdrop');
const lbCloseBtn = document.getElementById('lb-close');
const lbFullList = document.getElementById('lb-full-list');

// Mark things to blur (nav + container). Add class only once:
document.querySelector('.nav-bar')?.classList.add('blur-target');
document.querySelector('.container')?.classList.add('blur-target');

// ---------- OPEN / CLOSE ----------
function openLeaderboardModal() {
  // Render full list each open (in case data changed)
  renderFullLeaderboard(leaderboardData);

  lbModal.classList.add('open');
  document.body.classList.add('modal-open');

  // prevent body scroll while open
  document.body.style.overflow = 'hidden';
}

function closeLeaderboardModal() {
  lbModal.classList.remove('open');
  document.body.classList.remove('modal-open');

  document.body.style.overflow = '';
}

// Open from the small card (header or whole card)
lbCard?.addEventListener('click', openLeaderboardModal);
// Close actions
lbBackdrop?.addEventListener('click', closeLeaderboardModal);
lbCloseBtn?.addEventListener('click', closeLeaderboardModal);
// Esc key closes
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lbModal.classList.contains('open')) {
    closeLeaderboardModal();
  }
});

// ---------- RENDER: Full leaderboard (least → best) ----------
function renderFullLeaderboard(data) {
  const topEl = document.getElementById('lb-full-top');
  const midEl = document.getElementById('lb-full-scroll');
  const botEl = document.getElementById('lb-full-bottom');
  if (!topEl || !midEl || !botEl) return;

  topEl.innerHTML = '';
  midEl.innerHTML = '';
  botEl.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    midEl.textContent = 'No data yet.';
    return;
  }

  // Least hours = best (index 0). Most hours = worst (last).
  const sorted = [...data].sort((a, b) => a.minutes - b.minutes);

  if (sorted.length === 1) {
    topEl.appendChild(makeRow(1, sorted[0].name, sorted[0].minutes));
    return;
  }

  if (sorted.length === 2) {
    topEl.appendChild(makeRow(1, sorted[0].name, sorted[0].minutes));
    botEl.appendChild(makeRow(2, sorted[1].name, sorted[1].minutes));
    return;
  }

  // 3+ entries
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const middle = sorted.slice(1, -1);

  topEl.appendChild(makeRow(1, best.name, best.minutes));

  middle.forEach((p, i) => {
    const rank = i + 2; // ranks 2..n-1
    midEl.appendChild(makeRow(rank, p.name, p.minutes));
  });

  botEl.appendChild(makeRow(sorted.length, worst.name, worst.minutes));
}
