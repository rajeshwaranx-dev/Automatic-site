// ============================================================
//  AskMovies — script.js  (auto-loads from movies.json)
// ============================================================

const state = {
    currentPage: 1,
    moviesPerPage: 20,
    selectedCategory: 'All',
    searchQuery: '',
    filteredMovies: [],
    allMovies: []
};

// ── Load movies from JSON then boot the app ──────────────────
async function loadMovies() {
    try {
        // Add cache-buster so Netlify always serves the latest JSON
        const res = await fetch('movies.json?v=' + Date.now());
        if (!res.ok) throw new Error('Failed to fetch movies.json');
        const data = await res.json();
        // Newest movies first (highest id = most recently added)
        state.allMovies = data.reverse();
    } catch (err) {
        console.error('Could not load movies:', err);
        state.allMovies = [];
    }
    initializeApp();
}

document.addEventListener('DOMContentLoaded', loadMovies);

// ── App init ─────────────────────────────────────────────────
function initializeApp() {
    updateFilteredMovies();
    renderMovies();
    renderPagination();
    setupSearchToggle();
    setupSearchInput();
    setupCategoryFilters();
    setupPagination();
    setupMobileMenu();
}

// ── Filter logic ─────────────────────────────────────────────
function updateFilteredMovies() {
    let filtered = [...state.allMovies];
    if (state.selectedCategory !== 'All') {
        filtered = filtered.filter(m => m.category.includes(state.selectedCategory));
    }
    if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(m => m.title.toLowerCase().includes(q));
    }
    state.filteredMovies = filtered;
    state.currentPage = 1;
}

// ── Render movies ────────────────────────────────────────────
function renderMovies() {
    const grid = document.getElementById('moviesGrid');
    const noResults = document.getElementById('noResults');
    const start = (state.currentPage - 1) * state.moviesPerPage;
    const pageMovies = state.filteredMovies.slice(start, start + state.moviesPerPage);

    grid.innerHTML = '';

    if (pageMovies.length === 0) {
        noResults.style.display = 'flex';
        grid.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    grid.style.display = 'grid';

    pageMovies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="movie-poster-container">
                <img class="movie-poster" src="${movie.image}" alt="${movie.title}" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400'">
                <div class="movie-overlay">
                    <a href="${movie.telegramLink}" target="_blank" rel="noopener" class="download-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                    </a>
                </div>
                <div class="quality-badge">${movie.quality}</div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.year}</span>
                    <div class="movie-categories">
                        ${movie.category.map(c => `<span class="category-tag">${c}</span>`).join('')}
                    </div>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

// ── Pagination ───────────────────────────────────────────────
function renderPagination() {
    const totalPages = Math.ceil(state.filteredMovies.length / state.moviesPerPage);
    const pagination = document.getElementById('pagination');
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
    paginationNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-number' + (i === state.currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => { state.currentPage = i; renderMovies(); renderPagination(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        paginationNumbers.appendChild(pageBtn);
    }

    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage === totalPages;
}

function setupPagination() {
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (state.currentPage > 1) { state.currentPage--; renderMovies(); renderPagination(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredMovies.length / state.moviesPerPage);
        if (state.currentPage < totalPages) { state.currentPage++; renderMovies(); renderPagination(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
}

// ── Search ───────────────────────────────────────────────────
function setupSearchToggle() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    searchBtn.addEventListener('click', () => {
        const isActive = searchInput.classList.contains('active');
        if (isActive) {
            if (searchInput.value.trim() !== '') { searchInput.value = ''; state.searchQuery = ''; updateFilteredMovies(); renderMovies(); renderPagination(); }
            searchInput.classList.remove('active'); searchInput.blur();
        } else { searchInput.classList.add('active'); searchInput.focus(); }
    });
    document.addEventListener('click', e => {
        if (!searchBtn.contains(e.target) && !searchInput.contains(e.target)) {
            if (searchInput.value.trim() === '') searchInput.classList.remove('active');
        }
    });
}

function setupSearchInput() {
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { state.searchQuery = e.target.value; updateFilteredMovies(); renderMovies(); renderPagination(); }, 300);
    });
}

// ── Category filters ─────────────────────────────────────────
function setupCategoryFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedCategory = btn.dataset.category;
            updateFilteredMovies(); renderMovies(); renderPagination();
        });
    });
}

// ── Mobile menu ──────────────────────────────────────────────
function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    menuBtn.addEventListener('click', e => { e.stopPropagation(); mobileMenu.classList.toggle('active'); });
    document.addEventListener('click', e => { if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) mobileMenu.classList.remove('active'); });

    document.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            mobileMenu.classList.remove('active');
            const action = item.dataset.action;
            if (action === 'home') {
                state.selectedCategory = 'All'; state.searchQuery = '';
                document.getElementById('searchInput').value = '';
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.category === 'All'));
                updateFilteredMovies(); renderMovies(); renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (action === 'about') {
                alert('AskMovies - All Types of Movies Are Available Here!\n\nWe provide HD and PreDVD movies in Tamil and English.');
            } else if (action === 'contact') {
                window.open('https://t.me/askmovies', '_blank');
            }
        });
    });
                              }
                                                                                                                                             
