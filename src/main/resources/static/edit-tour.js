let tourId = null;

// Lấy tourId từ URL
function getTourIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tourId');
}

// Load tour data khi trang load
document.addEventListener('DOMContentLoaded', function() {
    tourId = getTourIdFromUrl();

    if (!tourId) {
        showError('Không tìm thấy ID tour!');
        return;
    }

    loadTourData();
});

// Load dữ liệu tour từ API
async function loadTourData() {
    try {
        showLoading();

        const response = await fetch(`http://localhost:8082/api/tour/${tourId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const tour = await response.json();
        populateForm(tour);
        hideLoading();

    } catch (error) {
        console.error('Lỗi khi load tour:', error);
        showError('Không thể tải thông tin tour!');
    }
}

// Điền dữ liệu vào form
function populateForm(tour) {
    document.getElementById('name').value = tour.name || '';
    document.getElementById('duration').value = tour.duration || '';
    document.getElementById('address').value = tour.address || '';
    document.getElementById('price').value = tour.price || '';
    document.getElementById('rating').value = tour.rating || '';
    document.getElementById('imageUrl').value = tour.imageUrl || '';
    document.getElementById('description').value = tour.description || '';

    // Show image preview if URL exists
    if (tour.imageUrl) {
        showImagePreview(tour.imageUrl);
    }
}

// Submit form để update tour
document.getElementById('tourForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const tourData = {
        id: parseInt(tourId), // Thêm ID để update
        name: document.getElementById('name').value.trim(),
        duration: parseInt(document.getElementById('duration').value) || null,
        address: document.getElementById('address').value.trim(),
        price: parseFloat(document.getElementById('price').value) || 0,
        rating: parseInt(document.getElementById('rating').value) || null,
        imageUrl: document.getElementById('imageUrl').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    // Validate required fields
    if (!tourData.name || !tourData.duration) {
        alert('Vui lòng nhập tên tour và thời gian!');
        return;
    }

    try {
        const response = await fetch('http://localhost:8082/api/tour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert('Cập nhật tour thành công!');
            window.location.href = 'index.html'; // Quay về trang chủ
        } else {
            alert('Lỗi khi cập nhật tour!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Lỗi kết nối!');
    }
});

// Image preview function
function showImagePreview(imageUrl) {
    const previewDiv = document.getElementById('imagePreview');
    if (imageUrl) {
        previewDiv.innerHTML = `
            <img src="${imageUrl}" class="img-thumbnail" style="max-width: 200px; max-height: 150px;" alt="Preview">
        `;
    } else {
        previewDiv.innerHTML = '';
    }
}

// Image URL change event
document.getElementById('imageUrl').addEventListener('input', function() {
    showImagePreview(this.value);
});

// UI helper functions
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('tourForm').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('tourForm').style.display = 'block';
}

function showError(message) {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('tourForm').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('errorMessage').querySelector('p').textContent = message;
}

function goBack() {
    window.location.href = 'index.html';
}