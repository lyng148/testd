// Biến global
let pois = [];

// Lấy tour ID từ URL
function getTourId() {
    return new URLSearchParams(window.location.search).get('tourId');
}

// Load dữ liệu POI
async function loadPOIs() {
    const tourId = getTourId();
    if (!tourId) return showEmpty();

    try {
        showLoading();
        const response = await fetch(`https://testd-ii75.onrender.com/api/listtour/${tourId}`);
        pois = await response.json();


        console.log('POI data:', pois);
        if (pois.length > 0) console.log('POI đầu tiên:', pois[0]);

        pois.length > 0 ? showPOIs(pois) : showEmpty();
    } catch (error) {
        console.error('Lỗi:', error);
        showEmpty();
    }
}

// Hiển thị trạng thái
function showLoading() {
    document.getElementById('poiList').classList.add('d-none');
    document.getElementById('empty').classList.add('d-none');
}

function showEmpty() {
    document.getElementById('poiList').classList.add('d-none');
    document.getElementById('empty').classList.remove('d-none');
}

function showPOIs(poisData) {
    document.getElementById('poiList').classList.remove('d-none');
    document.getElementById('empty').classList.add('d-none');
    document.getElementById('count').textContent = poisData.length;

    const html = poisData.map((poi, index) => `
        <div class="d-flex align-items-center p-3 border-bottom">
            <div class="poi-number me-3">${index + 1}</div>
            <div class="flex-grow-1">
                <h6 class="mb-0">${poi.name}</h6>
                <small class="text-muted">Điểm ${index + 1}</small>
            </div>
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="viewDetails(${poi.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePoi(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    document.getElementById('poiContainer').innerHTML = html + `
        <div class="d-flex justify-content-center p-3">
            <button class="btn btn-primary" onclick="addNewPoi()">
                <i class="fas fa-plus me-2"></i>Thêm địa điểm
            </button>
        </div>
    `;
}

// Xem chi tiết POI
function viewDetails(poiid) {
    console.log('POI ID:', poiid);
    if (!poiid) return alert('Không có ID POI!');
    window.location.href = `poi-detail.html?poiId=${poiid}`;
}

// Xóa POI
async function deletePoi(index) {
    const poi = pois[index];
    if (!confirm(`Xóa "${poi.name}"?`)) return;

    try {
        const response = await fetch(`https://testd-ii75.onrender.com/api/poioftour/${poi.tourPoiId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            pois.splice(index, 1);
            showPOIs(pois);
            alert('Xóa thành công!');
        } else {
            alert('Lỗi xóa!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Lỗi kết nối!');
    }
}

// Quay lại
function goBack() {
    window.history.back();
}
function addNewPoi() {
    // Lấy tourId từ URL (giống như getTourId())
    const tourId = getTourId(); // Dùng function đã có sẵn

    if (!tourId) {
        alert('Không tìm thấy Tour ID!');
        return;
    }

    window.location.href = `assign-poi.html?tourId=${tourId}`;
}
// Khởi chạy
document.addEventListener('DOMContentLoaded', loadPOIs);