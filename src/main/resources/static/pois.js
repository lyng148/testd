let allPois = [];
let filteredPois = [];

// Load POI
async function loadAllPois() {
    try {
        showLoading();
        const response = await fetch('https://testd-ii75.onrender.com/api/poi/all');
        allPois = await response.json();

        console.log('Loaded POIs:', allPois); // Debug

        if (allPois.length > 0) {
            filteredPois = [...allPois];
            renderPois();
            showPoiGrid();
        } else {
            showEmpty();
        }
    } catch (error) {
        console.error('Lỗi:', error);
        showEmpty();
    }
}

// Show states
function showLoading() {
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('poiGrid').classList.add('d-none');
    document.getElementById('empty').classList.add('d-none');
}

function showPoiGrid() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('poiGrid').classList.remove('d-none');
    document.getElementById('empty').classList.add('d-none');
}

function showEmpty() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('poiGrid').classList.add('d-none');
    document.getElementById('empty').classList.remove('d-none');
}

// Render POIs
function renderPois() {
    const html = filteredPois.map(poi => {
        // Tạo placeholder ảnh cố định nếu không có ảnh
        const imageElement = poi.imageUrl ?
            `<img src="${poi.imageUrl}" 
                 class="card-img-top poi-image" 
                 alt="${poi.name}"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="poi-no-image" style="display: none;">
                 <i class="fas fa-image"></i>
                 <span>Chưa có ảnh</span>
             </div>`
            :
            `<div class="poi-no-image">
                 <i class="fas fa-image"></i>
                 <span>Chưa có ảnh</span>
             </div>`;

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card poi-card h-100 shadow-sm">
                    <div class="position-relative poi-image-container">
                        ${imageElement}
                        <div class="poi-image-overlay"></div>
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="badge bg-primary rounded-pill px-3">${poi.typename || 'Chưa phân loại'}</span>
                        </div>
                        <div class="position-absolute top-0 end-0 m-2">
                            <div class="d-flex gap-1">
                                <button class="btn btn-warning btn-sm rounded-circle poi-action-btn" onclick="editPoi(${poi.id})" title="Chỉnh sửa POI">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-sm rounded-circle poi-action-btn" onclick="deletePoi(${poi.id})" title="Xóa POI">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary fw-bold mb-2">${poi.name}</h5>
                        <div class="mb-2">
                            <small class="text-muted">
                                <i class="fas fa-map-marker-alt text-danger me-1"></i>
                                ${poi.address || 'Chưa có địa chỉ'}
                            </small>
                        </div>
                        <div class="mb-2">
                            <small class="text-info">
                                <i class="fas fa-clock me-1"></i>
                                ${poi.openTime || 'N/A'} - ${poi.closeTime || 'N/A'}
                            </small>
                        </div>
                        <p class="card-text text-secondary flex-grow-1 mb-3">
                            ${(poi.description || 'Chưa có mô tả').substring(0, 100)}${poi.description && poi.description.length > 100 ? '...' : ''}
                        </p>
                        
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('poiContainer').innerHTML = html;
    document.getElementById('totalCount').textContent = filteredPois.length;
}

// Thêm function editPoi
function editPoi(id) {
    window.location.href = `edit-poi.html?poiId=${id}`;
}

// Actions




async function deletePoi(id) {
    const poi = filteredPois.find(p => p.id === id); // Sửa từ allPois thành filteredPois
    if (!confirm(`Xóa "${poi.name}"?`)) return;

    try {
        // Sửa endpoint để khớp với backend
        const response = await fetch(`https://testd-ii75.onrender.com/api/onepoi/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Xóa thành công!');
            loadAllPois(); // Reload lại danh sách
        } else {
            alert('Lỗi xóa!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Lỗi kết nối!');
    }
}

function addNewPoi() {
    window.location.href = 'add-poi.html';
}
//loc poi
async function filterPois() {
    const type = document.getElementById('typeFilter').value;

    console.log('Filter by type:', type); // Debug

    try {
        showLoading(); // Hiển thị loading

        let pois = [];

        if (type) {
            // Gọi API lọc theo typename - SỬA ENDPOINT
            console.log('Calling API:', `https://testd-ii75.onrender.com/api/poi/typename/${encodeURIComponent(type)}`);
            const response = await fetch(`https://testd-ii75.onrender.com/api/poi/typename?typename=${encodeURIComponent(type)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            pois = await response.json();
            console.log('Filtered POIs:', pois); // Debug
        } else {
            // Nếu không chọn loại, hiển thị tất cả
            pois = [...allPois];
        }

        filteredPois = pois;
        renderPois();
        showPoiGrid();

    } catch (error) {
        console.error("Lỗi khi lọc POI:", error);
        showEmpty();
    }
}

function goBack1() {
    window.location.href = 'https://testd-ii75.onrender.com/index.html';
}

// Start
document.addEventListener('DOMContentLoaded', loadAllPois);
