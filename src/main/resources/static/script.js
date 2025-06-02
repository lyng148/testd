// Global variables
let tours = [];
let filteredTours = [];
let selectedRating = null;
let selectedDurations = [];
let isLoading = false;
let currentSearchParams = {};

// API Base URL
const API_BASE_URL = 'https://testd-ii75.onrender.com';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeFilters();
    loadInitialTours();
});


function initializeFilters() {
    console.log('Initializing filters...');

    // Star rating
    initializeStarRating();

    // Duration buttons
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const duration = this.dataset.duration;
            if (selectedDurations.includes(duration)) {
                selectedDurations = selectedDurations.filter(d => d !== duration);
                this.classList.remove('active');
            } else {
                selectedDurations.push(duration);
                this.classList.add('active');
            }
            console.log('Duration selected:', selectedDurations);
            updateSearchButtonState(); // Thêm cái này nếu muốn cập nhật nút Search
        });
    });

    // Sort change
    document.getElementById('sortBy').addEventListener('change', applySortingAndDisplay);

    // Filter inputs
    document.getElementById('typetour').addEventListener('change', updateSearchButtonState);
    document.getElementById('address').addEventListener('input', updateSearchButtonState);
    document.getElementById('maxPrice').addEventListener('input', updateSearchButtonState);
}



function initializeStarRating() {
    const starButtons = document.querySelectorAll('.star-btn');
    const ratingText = document.getElementById('ratingText');

    starButtons.forEach((star, index) => {
        // Click event
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);

            if (selectedRating === rating) {
                selectedRating = null;
                updateStarDisplay(0);
                ratingText.textContent = 'Chọn đánh giá';
            } else {
                selectedRating = rating;
                updateStarDisplay(rating);
                ratingText.textContent = `${rating} sao`;
            }
            console.log('Rating selected:', selectedRating);
            // BỎ performSearch() - không tự động search
            updateSearchButtonState(); // Thêm visual feedback
        });

        // Hover events
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });

    // Mouse leave event
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        updateStarDisplay(selectedRating || 0);
    });
}

// THÊM FUNCTION MỚI: Cập nhật trạng thái nút search
function updateSearchButtonState() {
    const searchBtn = document.querySelector('.search-btn');
    const hasFilters = checkIfHasFilters();

    if (hasFilters) {
        searchBtn.classList.add('has-filters');
        searchBtn.innerHTML = '<i class="fas fa-search me-2"></i>Tìm kiếm với bộ lọc';
    } else {
        searchBtn.classList.remove('has-filters');
        searchBtn.innerHTML = '<i class="fas fa-search me-2"></i>Tìm kiếm tour';
    }
}

// THÊM FUNCTION MỚI: Kiểm tra có filter nào được set không
function checkIfHasFilters() {
    const typetour = document.getElementById('typetour').value;
    const address = document.getElementById('address').value;
    const maxPrice = document.getElementById('maxPrice').value;

    return typetour || address || maxPrice || selectedRating || selectedDurations.length > 0;
}

// Update star display
function updateStarDisplay(rating) {
    const starButtons = document.querySelectorAll('.star-btn');

    starButtons.forEach((star, index) => {
        const starRating = index + 1;
        star.classList.remove('active', 'filled');

        if (starRating <= rating) {
            star.classList.add('filled');
        }

        if (starRating === rating) {
            star.classList.add('active');
        }
    });
}

// Highlight stars on hover
function highlightStars(rating) {
    const starButtons = document.querySelectorAll('.star-btn');

    starButtons.forEach((star, index) => {
        const starRating = index + 1;
        const starIcon = star.querySelector('i');

        if (starRating <= rating) {
            starIcon.style.color = '#fbbf24';
        } else {
            starIcon.style.color = '#d1d5db';
        }
    });
}

// Load initial tours
async function loadInitialTours() {
    console.log('Loading initial tours...');
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/tour`);
        console.log('API Response status:', response.status);

        if (response.ok) {
            tours = await response.json();
            console.log('Tours loaded:', tours.length);
            filteredTours = [...tours];
            displayTours(filteredTours);
        } else {
            throw new Error(`API Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading tours:', error);
        console.log('Using mock data...');
        tours = getMockTours();
        filteredTours = [...tours];
        displayTours(filteredTours);
    } finally {
        showLoading(false);
        updateSearchButtonState(); // Cập nhật trạng thái nút
    }
}

// Main search function - CHỈ CHẠY KHI BẤM NÚT
async function performSearch() {
    console.log('Manual search triggered by button click');

    const newSearchParams = getSearchParams();
    console.log('Performing search with params:', newSearchParams);

    // Reset để force search mới
    currentSearchParams = {};
    showLoading(true);

    try {
        const params = new URLSearchParams();

        // CHỈ 5 FIELD: typetour, address, price, rating, duration
        if (newSearchParams.typetour) params.append('typetour', newSearchParams.typetour);
        if (newSearchParams.address) params.append('address', newSearchParams.address);
        if (newSearchParams.price) params.append('price', newSearchParams.price);
        if (newSearchParams.rating) params.append('rating', newSearchParams.rating);

        // Multiple duration values
        newSearchParams.durations.forEach(duration => {
            params.append('duration', duration);
        });

        const apiUrl = `${API_BASE_URL}/api/tour${params.toString() ? '?' + params.toString() : ''}`;
        console.log('API Call:', apiUrl);

        const response = await fetch(apiUrl);

        if (response.ok) {
            let apiResults = await response.json();
            console.log('API Results:', apiResults.length);

            tours = apiResults;
            filteredTours = [...apiResults];

            // Update search params sau khi search thành công
            currentSearchParams = { ...newSearchParams };

            applySortingAndDisplay();

            // Scroll to results
            document.querySelector('.results-section').scrollIntoView({
                behavior: 'smooth'
            });

        } else {
            throw new Error(`API Error: ${response.status}`);
        }

    } catch (error) {
        console.error('Search error:', error);
        applyClientSideFilters();
    } finally {
        showLoading(false);
        updateSearchButtonState();
    }
}

// Get current search parameters
function getSearchParams() {
    return {
        typetour: document.getElementById('typetour').value || null,
        address: document.getElementById('address').value || null,
        price: document.getElementById('maxPrice').value || null,
        rating: selectedRating,
        durations: [...selectedDurations],
        sortBy: document.getElementById('sortBy').value || 'newest'
    };
}



// Apply sorting and display
function applySortingAndDisplay() {
    applySorting();
    displayTours(filteredTours);
}

// Apply sorting
function applySorting() {
    const sortBy = document.getElementById('sortBy').value;
    console.log('Sorting by:', sortBy);

    switch (sortBy) {
        case 'price-low':
            filteredTours.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredTours.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredTours.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            filteredTours.sort((a, b) => b.id - a.id);
            break;
    }
}

// Display tours
function displayTours(tours) {
    console.log('Displaying tours:', tours.length);
    const list = document.getElementById('toursList');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');

    resultsCount.textContent = tours.length;

    if (tours.length === 0) {
        list.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    // Remove duplicates by ID
    const uniqueTours = tours.filter((tour, index, self) =>
        index === self.findIndex(t => t.id === tour.id)
    );

    list.innerHTML = uniqueTours.map((tour, index) => createTourItem(tour, index)).join('');
}

// Create tour item HTML
function createTourItem(tour, index) {
    return `
        <div class="tour-item" style="animation-delay: ${index * 0.1}s">
            <div class="row g-0">
                <div class="col-md-4">
                    <div class="tour-item-image">
                        <img src="${tour.imageUrl || 'https://via.placeholder.com/400x250?text=Tour+Image'}" 
                             alt="${tour.name}" 
                             onerror="this.src='https://via.placeholder.com/400x250?text=Tour+Image'">
                        <div class="tour-rating-horizontal">
                            <i class="fas fa-star"></i>
                            <span>${tour.rating}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="tour-item-content">
                        <div>
                            <h3 class="tour-item-name">${tour.name}</h3>
                            
                            <div class="tour-item-info">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${tour.address}</span>
                            </div>
                            
                            <div class="tour-item-info">
                                <i class="fas fa-clock"></i>
                                <span>${tour.duration}</span>
                            </div>
                            
                            <p class="tour-item-description">${tour.description}</p>
                        </div>
                        
                        <div class="tour-item-footer">
                            <div class="tour-item-price">
                                <span class="price-amount-large">${formatPrice(tour.price)}</span>
                                <span class="price-label-large">/ người</span>
                            </div>
                            <div class="tour-action-buttons">
                                <button class="btn btn-detail" onclick="viewTourDetail(${tour.id})" title="Xem chi tiết tour ${tour.name}">
                                    <i class="fas fa-eye me-1"></i>Chi tiết
                                </button>
                                <button class="btn btn-edit" onclick="editTour(${tour.id})" title="Chỉnh sửa tour ${tour.name}">
                                    <i class="fas fa-edit me-1"></i>Sửa
                                </button>
                                <button class="btn btn-delete" onclick="deleteTour(${tour.id})" title="Xóa tour ${tour.name}">
                                    <i class="fas fa-trash me-1"></i>Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Clear all filters
function clearAllFilters() {
    console.log('Clearing all filters...');

    // Reset fields
    document.getElementById('typetour').value = '';
    document.getElementById('address').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortBy').value = 'newest';

    // Reset selections
    selectedRating = null;
    selectedDurations = [];

    // Reset UI
    updateStarDisplay(0);
    document.getElementById('ratingText').textContent = 'Chọn đánh giá';
    document.querySelectorAll('.duration-btn').forEach(btn => btn.classList.remove('active'));

    // Reset search params
    currentSearchParams = {};

    // Load initial tours
    loadInitialTours();
}

function viewTourDetail(tourId) {
    // Chuyển sang trang chi tiết với tour ID
    window.location.href = `tour-detail.html?tourId=${tourId}`;
}

function editTour(id) {
    window.location.href = `edit-tour.html?tourId=${id}`;
}
// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const toursList = document.getElementById('toursList');

    if (loadingState && toursList) {
        loadingState.style.display = show ? 'block' : 'none';
        toursList.style.display = show ? 'none' : 'block';
    }

    isLoading = show;
    console.log('Loading state:', show);
}

// Mock data for fallback
function deleteTour(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa tour này?")) return;

    fetch(`https://testd-ii75.onrender.com/api/tour/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert("Xóa tour thành công!");

                // Xóa khỏi mảng hiện tại
                tours = tours.filter(t => t.id !== id);
                filteredTours = filteredTours.filter(t => t.id !== id);
                displayTours(filteredTours);
            } else {
                alert("Lỗi khi xóa tour!");
            }
        })
        .catch(error => {
            console.error("Lỗi khi kết nối server:", error);
            alert("Xảy ra lỗi khi xóa tour!");
        });
}



// Global functions for buttons
window.performSearch = performSearch;
window.clearAllFilters = clearAllFilters;
window.bookTour = bookTour;
