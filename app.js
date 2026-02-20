// ═══════════════════════════════════════════════════════════════════
// ASKMOVIES - MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════

// Load movies from movies-data.js
let movies = moviesData;

// Application state
const state = {
    currentPage: 1,
    moviesPerPage: 20,
    selectedCategory: 'All',
    searchQuery: '',
    filteredMovies: [...movies]
};

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Auto-generate IDs for movies
    movies.forEach((movie, index) => {
        movie.id = index + 1;
    });

    // Initialize the app
    updateFilteredMovies();
    renderMovies();
    renderPagination();
    setupSearchToggle();
    setupSearchInput();
    setupCategoryFilters();
    setupPagination();
    setupMobileMenu();
}

// ═══════════════════════════════════════════════════════════════════
// FILTER ENGINE
// ═══════════════════════════════════════════════════════════════════

function updateFilteredMovies() {
    let filtered = [...movies];

    // Filter by category
    if (state.selectedCategory !== 'All') {
        filtered = filtered.filter(movie => 
            movie.category.includes(state.selectedCategory)
        );
    }

    // Filter by search query
    if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(movie => 
            movie.title.toLowerCase().includes(query)
        );
    }

    state.filteredMovies = filtered;
    state.currentPage = 1; // Reset to first page
}

// ═══════════════════════════════════════════════════════════════════
// RENDER MOVIES
// ═══════════════════════════════════════════════════════════════════

function renderMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    const noResults = document.getElementById('noResults');
    
    moviesGrid.innerHTML = '';

    // Show/hide no results message
    if (state.filteredMovies.length === 0) {
        noResults.classList.add('active');
        moviesGrid.style.display = 'none';
        return;
    } else {
        noResults.classList.remove('active');
        moviesGrid.style.display = 'grid';
    }

    // Calculate pagination
    const startIndex = (state.currentPage - 1) * state.moviesPerPage;
    const endIndex = startIndex + state.moviesPerPage;
    const moviesToShow = state.filteredMovies.slice(startIndex, endIndex);

    // Render movie cards
    moviesToShow.forEach(movie => {
        const card = createMovieCard(movie);
        moviesGrid.appendChild(card);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => window.open(movie.telegramLink, '_blank');
    
    card.innerHTML = `
        <div class="movie-poster-container">
            <img src="${movie.image}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="quality-badge">${movie.quality}</div>
            <div class="movie-overlay">
                <button class="watch-btn">Watch Now</button>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-year">${movie.year}</p>
            <div class="movie-categories">
                ${movie.category.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// ═══════════════════════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════════════════════

function renderPagination() {
    const totalPages = Math.ceil(state.filteredMovies.length / state.moviesPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pagination = document.getElementById('pagination');

    // Hide pagination if not needed
    if (state.filteredMovies.length === 0 || totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    } else {
        pagination.style.display = 'flex';
    }

    // Clear existing page numbers
    paginationNumbers.innerHTML = '';

    // Create page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number';
        pageBtn.textContent = i;
        
        if (i === state.currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.addEventListener('click', () => {
            state.currentPage = i;
            renderMovies();
            renderPagination();
        });
        
        paginationNumbers.appendChild(pageBtn);
    }

    // Update prev/next buttons
    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage === totalPages;
}

function setupPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderMovies();
            renderPagination();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredMovies.length / state.moviesPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderMovies();
            renderPagination();
        }
    });
}

// ═══════════════════════════════════════════════════════════════════
// SEARCH FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════

function setupSearchToggle() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', () => {
        const isActive = searchInput.classList.contains('active');
        
        if (isActive) {
            // Clear search if active
            if (searchInput.value.trim() !== '') {
                searchInput.value = '';
                state.searchQuery = '';
                updateFilteredMovies();
                renderMovies();
                renderPagination();
            }
            searchInput.classList.remove('active');
            searchInput.blur();
        } else {
            // Activate search
            searchInput.classList.add('active');
            searchInput.focus();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchBtn.contains(e.target) && !searchInput.contains(e.target)) {
            if (searchInput.value.trim() === '') {
                searchInput.classList.remove('active');
            }
        }
    });
}

function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.searchQuery = e.target.value;
            updateFilteredMovies();
            renderMovies();
            renderPagination();
        }, 300); // Debounce for 300ms
    });
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY FILTERS
// ═══════════════════════════════════════════════════════════════════

function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update filter
            state.selectedCategory = btn.dataset.category;
            updateFilteredMovies();
            renderMovies();
            renderPagination();
        });
    });
}

// ═══════════════════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════════════════

function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Toggle menu
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}
