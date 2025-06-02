let tourId = null;
let availablePois = [];
let selectedPois = [];

document.addEventListener('DOMContentLoaded', function() {
    tourId = getTourIdFromUrl();

    if (!tourId) {
        alert('Không tìm thấy ID tour!');
        goBack();
        return;
    }

    loadTourInfo();
    loadAvailablePois();
    setupSearchFilter();
});

function getTourIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tourId');
}

async function loadTourInfo() {
    try {
        const response = await fetch(`https://testd-ii75.onrender.com/api/tour/${tourId}`);
        const tour = await response.json();

        document.getElementById('tourInfo').innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-route text-primary me-3 fs-4"></i>
                <div>
                    <h6 class="mb-0">${tour.name}</h6>
                    <small class="text-muted">${tour.duration} ngày - ${tour.address || 'Không có địa chỉ'}</small>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Lỗi load tour info:', error);
    }
}

async function loadAvailablePois() {
    try {
        const response = await fetch('https://testd-ii75.onrender.com/api/poi/all');
        availablePois = await response.json();
        renderAvailablePois();
    } catch (error) {
        console.error('Lỗi load POIs:', error);
        document.getElementById('availablePois').innerHTML =
            '<p class="text-danger">Lỗi tải danh sách POI!</p>';
    }
}

function renderAvailablePois(filteredPois = null) {
    const poisToRender = filteredPois || availablePois;
    const container = document.getElementById('availablePois');

    if (poisToRender.length === 0) {
        container.innerHTML = '<p class="text-muted">Không có POI nào</p>';
        return;
    }

    container.innerHTML = poisToRender.map(poi => `
        <div class="poi-item" onclick="togglePoiSelection(${poi.id})">
            <div class="d-flex">
                <img src="${poi.imageUrl || 'https://via.placeholder.com/60'}" 
                     class="me-3" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${poi.name}</h6>
                    <p class="mb-1 text-muted small">${poi.address || 'Không có địa chỉ'}</p>
                    <span class="badge bg-secondary">${poi.typename || 'Khác'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function togglePoiSelection(poiId) {
    const poi = availablePois.find(p => p.id === poiId);
    if (!poi) return;

    const existingIndex = selectedPois.findIndex(p => p.poiId === poiId);

    if (existingIndex > -1) {
        // Remove POI
        selectedPois.splice(existingIndex, 1);
        // Reorder remaining POIs
        selectedPois.forEach((p, index) => p.orderintour = index + 1);
    } else {
        // Add POI
        selectedPois.push({
            poiId: poiId,
            name: poi.name,
            address: poi.address,
            imageUrl: poi.imageUrl,
            orderintour: selectedPois.length + 1
        });
    }

    renderSelectedPois();
    updateSaveButton();
}

function renderSelectedPois() {
    const container = document.getElementById('selectedPois');

    if (selectedPois.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Chưa có POI nào được chọn</p>';
        return;
    }

    container.innerHTML = selectedPois.map(poi => `
        <div class="selected-poi-item">
            <div class="order-badge">${poi.orderintour}</div>
            <div class="flex-grow-1 ms-3">
                <h6 class="mb-0">${poi.name}</h6>
                <small class="text-muted">${poi.address || 'Không có địa chỉ'}</small>
            </div>
            <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary" onclick="movePoiUp(${poi.poiId})" 
                        ${poi.orderintour === 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="movePoiDown(${poi.poiId})"
                        ${poi.orderintour === selectedPois.length ? 'disabled' : ''}>
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="togglePoiSelection(${poi.poiId})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function movePoiUp(poiId) {
    const index = selectedPois.findIndex(p => p.poiId === poiId);
    if (index > 0) {
        [selectedPois[index], selectedPois[index - 1]] = [selectedPois[index - 1], selectedPois[index]];
        selectedPois.forEach((p, i) => p.orderintour = i + 1);
        renderSelectedPois();
    }
}

function movePoiDown(poiId) {
    const index = selectedPois.findIndex(p => p.poiId === poiId);
    if (index < selectedPois.length - 1) {
        [selectedPois[index], selectedPois[index + 1]] = [selectedPois[index + 1], selectedPois[index]];
        selectedPois.forEach((p, i) => p.orderintour = i + 1);
        renderSelectedPois();
    }
}

function setupSearchFilter() {
    document.getElementById('searchPoi').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filtered = availablePois.filter(poi =>
            poi.name.toLowerCase().includes(searchTerm) ||
            (poi.address && poi.address.toLowerCase().includes(searchTerm)) ||
            (poi.typename && poi.typename.toLowerCase().includes(searchTerm))
        );
        renderAvailablePois(filtered);
    });
}

function updateSaveButton() {
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = selectedPois.length === 0;
}

async function saveTourPois() {
    if (selectedPois.length === 0) {
        alert('Vui lòng chọn ít nhất một POI!');
        return;
    }

    const requestData = {
        tourId: parseInt(tourId),
        poiList: selectedPois.map(poi => ({
            poiId: poi.poiId,
            orderintour: poi.orderintour
        }))
    };

    try {
        const response = await fetch('https://testd-ii75.onrender.com/api/assignpoi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            alert('Gán POI vào tour thành công!');
            goBack();
        } else {
            alert('Lỗi khi gán POI vào tour!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Lỗi kết nối!');
    }
}

function goBack() {
    window.location.href = 'index.html';
}