const movies = [
            { title: "Master", year: 2021, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Vikram", year: 2022, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Beast", year: 2022, quality: "PreDvd", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1574267432644-f410f8ec4faf?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "The Dark Knight", year: 2008, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Inception", year: 2010, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Interstellar", year: 2014, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Valimai", year: 2022, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Varisu", year: 2023, quality: "PreDvd", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Avatar", year: 2009, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Avengers Endgame", year: 2019, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Thunivu", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Ponniyin Selvan", year: 2022, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Top Gun Maverick", year: 2022, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Spider-Man No Way Home", year: 2021, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Leo", year: 2023, quality: "PreDvd", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Jailer", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "The Batman", year: 2022, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Doctor Strange", year: 2022, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Kaththi", year: 2014, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1574267432644-f410f8ec4faf?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Theri", year: 2016, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Mersal", year: 2017, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Bigil", year: 2019, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Mission Impossible", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Fast X", year: 2023, quality: "PreDvd", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Kaithi", year: 2019, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Darbar", year: 2020, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "John Wick 4", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Extraction 2", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Aarattu", year: 2022, quality: "PreDvd", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Sarkar", year: 2018, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Aquaman", year: 2023, quality: "PreDvd", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "The Flash", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Annaatthe", year: 2021, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Maanaadu", year: 2021, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Guardians Galaxy 3", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Ant-Man Quantumania", year: 2023, quality: "PreDvd", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Ayalaan", year: 2024, quality: "PreDvd", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1574267432644-f410f8ec4faf?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Captain Miller", year: 2024, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Transformers Rise", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Indiana Jones 5", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Mark Antony", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Jawan", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "The Equalizer 3", year: 2023, quality: "PreDvd", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Expend4bles", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Viduthalai", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Pathu Thala", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Blue Beetle", year: 2023, quality: "HD", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Shazam 2", year: 2023, quality: "PreDvd", category: ["English", "Action"], image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Vaathi", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=400", telegramLink: "https://t.me/askmovies" },
            { title: "Por Thozhil", year: 2023, quality: "HD", category: ["Tamil", "Action"], image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400", telegramLink: "https://t.me/askmovies" }
        ];

        movies.forEach((movie, index) => { movie.id = index + 1; });
        const state = { currentPage: 1, moviesPerPage: 20, selectedCategory: 'All', searchQuery: '', filteredMovies: [...movies] };

        document.addEventListener('DOMContentLoaded', () => { initializeApp(); });

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

        function updateFilteredMovies() {
            let filtered = [...movies];
            if (state.selectedCategory !== 'All') { filtered = filtered.filter(movie => movie.category.includes(state.selectedCategory)); }
            if (state.searchQuery.trim() !== '') { const query = state.searchQuery.toLowerCase(); filtered = filtered.filter(movie => movie.title.toLowerCase().includes(query)); }
            state.filteredMovies = filtered;
            state.currentPage = 1;
        }

        function renderMovies() {
            const moviesGrid = document.getElementById('moviesGrid');
            const noResults = document.getElementById('noResults');
            moviesGrid.innerHTML = '';
            if (state.filteredMovies.length === 0) { noResults.classList.add('active'); moviesGrid.style.display = 'none'; return; } else { noResults.classList.remove('active'); moviesGrid.style.display = 'grid'; }
            const startIndex = (state.currentPage - 1) * state.moviesPerPage;
            const endIndex = startIndex + state.moviesPerPage;
            const moviesToShow = state.filteredMovies.slice(startIndex, endIndex);
            moviesToShow.forEach(movie => { const card = createMovieCard(movie); moviesGrid.appendChild(card); });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function createMovieCard(movie) {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.onclick = () => window.open(movie.telegramLink, '_blank');
            card.innerHTML = `<div class="movie-poster-container"><img src="${movie.image}" alt="${movie.title}" class="movie-poster" loading="lazy"><div class="quality-badge">${movie.quality}</div><div class="movie-overlay"><button class="watch-btn">Watch Now</button></div></div><div class="movie-info"><h3 class="movie-title">${movie.title}</h3><p class="movie-year">${movie.year}</p><div class="movie-categories">${movie.category.map(cat => `<span class="category-tag">${cat}</span>`).join('')}</div></div>`;
            return card;
        }

        function renderPagination() {
            const totalPages = Math.ceil(state.filteredMovies.length / state.moviesPerPage);
            const paginationNumbers = document.getElementById('paginationNumbers');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const pagination = document.getElementById('pagination');
            if (state.filteredMovies.length === 0 || totalPages <= 1) { pagination.style.display = 'none'; return; } else { pagination.style.display = 'flex'; }
            paginationNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'page-number';
                pageBtn.textContent = i;
                if (i === state.currentPage) { pageBtn.classList.add('active'); }
                pageBtn.addEventListener('click', () => { state.currentPage = i; renderMovies(); renderPagination(); });
                paginationNumbers.appendChild(pageBtn);
            }
            prevBtn.disabled = state.currentPage === 1;
            nextBtn.disabled = state.currentPage === totalPages;
        }

        function setupPagination() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            prevBtn.addEventListener('click', () => { if (state.currentPage > 1) { state.currentPage--; renderMovies(); renderPagination(); } });
            nextBtn.addEventListener('click', () => { const totalPages = Math.ceil(state.filteredMovies.length / state.moviesPerPage); if (state.currentPage < totalPages) { state.currentPage++; renderMovies(); renderPagination(); } });
        }

        function setupSearchToggle() {
            const searchBtn = document.getElementById('searchBtn');
            const searchInput = document.getElementById('searchInput');
            searchBtn.addEventListener('click', () => {
                const isActive = searchInput.classList.contains('active');
                if (isActive) { if (searchInput.value.trim() !== '') { searchInput.value = ''; state.searchQuery = ''; updateFilteredMovies(); renderMovies(); renderPagination(); } searchInput.classList.remove('active'); searchInput.blur(); } else { searchInput.classList.add('active'); searchInput.focus(); }
            });
            document.addEventListener('click', (e) => { if (!searchBtn.contains(e.target) && !searchInput.contains(e.target)) { if (searchInput.value.trim() === '') { searchInput.classList.remove('active'); } } });
        }

        function setupSearchInput() {
            const searchInput = document.getElementById('searchInput');
            let searchTimeout;
            searchInput.addEventListener('input', (e) => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { state.searchQuery = e.target.value; updateFilteredMovies(); renderMovies(); renderPagination(); }, 300); });
        }

        function setupCategoryFilters() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => { btn.addEventListener('click', () => { filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.selectedCategory = btn.dataset.category; updateFilteredMovies(); renderMovies(); renderPagination(); }); });
        }

   function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    const menuItems = document.querySelectorAll('.mobile-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.dataset.action;
            mobileMenu.classList.remove('active');

            if (action === 'home') {
                state.selectedCategory = 'All';
                state.searchQuery = '';
                document.getElementById('searchInput').value = '';
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.category === 'All');
                });
                updateFilteredMovies();
                renderMovies();
                renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (action === 'about') {
                alert('AskMovies - All Types of Movies Are Available Here!\n\nWe provide HD and PreDVD movies in Tamil and English.');
            } else if (action === 'contact') {
                window.open('https://t.me/askmovies', '_blank');
            }
        });
    });
}
