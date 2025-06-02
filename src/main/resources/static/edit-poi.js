let currentPoi = null;

// Load POI data when page loads
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const poiId = urlParams.get('poiId');

    if (!poiId) {
        showError();
        return;
    }

    loadPoiData(poiId);
});

// Load POI data from API
async function loadPoiData(poiId) {
    try {
        showLoading();

        const response = await fetch(`https://testd-ii75.onrender.com/api/onepoi/${poiId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        currentPoi = await response.json();
        console.log('Loaded POI:', currentPoi);

        populateForm(currentPoi);
        showForm();

    } catch (error) {
        console.error('Lỗi khi tải POI:', error);
        showError();
    }
}

// Populate form with POI data
function populateForm(poi) {
    document.getElementById('poiId').value = poi.id || '';
    document.getElementById('name').value = poi.name || '';
    document.getElementById('typename').value = poi.typename || '';
    document.getElementById('address').value = poi.address || '';
    document.getElementById('openTime').value = poi.openTime || '';
    document.getElementById('closeTime').value = poi.closeTime || '';
    document.getElementById('price').value = poi.price || '';
    document.getElementById('imageUrl').value = poi.imageUrl || '';
    document.getElementById('description').value = poi.description || '';

    // Show image preview
    showImagePreview(poi.imageUrl);
}

// Show image preview
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

// Handle form submission
document.getElementById('editPoiForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const poiId = document.getElementById('poiId').value;

    // Collect form data
    const poiData = {
        id: parseInt(poiId),
        name: document.getElementById('name').value.trim(),
        typename: document.getElementById('typename').value,
        address: document.getElementById('address').value.trim(),
        openTime: document.getElementById('openTime').value,
        closeTime: document.getElementById('closeTime').value,
        price: parseFloat(document.getElementById('price').value) || 0,
        imageUrl: document.getElementById('imageUrl').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    // Validate required fields
    if (!poiData.name || !poiData.typename) {
        alert('Vui lòng nhập tên POI và chọn loại POI!');
        return;
    }

    try {
        const response = await fetch(`https://testd-ii75.onrender.com/api/onepoi`, {
            method: 'POST', // Sử dụng POST vì backend dùng saveorupdate
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(poiData)
        });

        if (response.ok) {
            alert('Cập nhật POI thành công!');
            window.location.href = 'pois.html'; // Quay về danh sách
        } else {
            alert('Lỗi khi cập nhật POI!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Lỗi kết nối!');
    }
});

// Show/Hide functions
function showLoading() {
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('error').classList.add('d-none');
    document.getElementById('formContainer').classList.add('d-none');
}

function showError() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('error').classList.remove('d-none');
    document.getElementById('formContainer').classList.add('d-none');
}

function showForm() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('error').classList.add('d-none');
    document.getElementById('formContainer').classList.remove('d-none');
}

function goBack() {
    window.history.back();
}