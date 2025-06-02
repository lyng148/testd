
function getPoiId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('poiId');
}


async function loadPoiDetail() {
    const poiId = getPoiId();
    console.log('POI ID from URL:', poiId); // Debug

    if (!poiId) {
        console.error('Không có POI ID');
        showError();
        return;
    }

    try {
        showLoading();

        // Gọi API chi tiết POI
        const response = await fetch(`https://testd-ii75.onrender.com/api/poi/${poiId}`);
        console.log('API Response status:', response.status); // Debug

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const poi = await response.json();
        console.log('POI detail data:', poi); // Debug
        showPoiDetail(poi);

    } catch (error) {
        console.error('Lỗi load POI detail:', error);
        showError();
    }
}

// Hiển thị loading
function showLoading() {
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('poiDetail').classList.add('d-none');
    document.getElementById('error').classList.add('d-none');
}


function showPoiDetail(poi) {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('poiDetail').classList.remove('d-none');
    document.getElementById('error').classList.add('d-none');

    // Cập nhật thông tin POI
    document.getElementById('poiName').textContent = poi.name || 'Chưa có tên';
    document.getElementById('poiType').textContent = poi.typename || 'Chưa phân loại';
    document.getElementById('poiAddress').textContent = poi.address || 'Chưa có địa chỉ';
    document.getElementById('poiOpenTime').textContent = poi.openTime || 'Chưa có thông tin';
    document.getElementById('poiCloseTime').textContent = poi.closeTime || 'Chưa có thông tin';
    document.getElementById('poiDescription').textContent = poi.description || 'Chưa có mô tả';

    const priceElement = document.getElementById('poiPrice');
    if (poi.price && poi.price > 0) {
        priceElement.textContent = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(poi.price);
    } else {
        priceElement.textContent = 'Miễn phí';
    }

    // Hiển thị hình ảnh
    const imageElement = document.getElementById('poiImage');
    if (poi.imageUrl) {
        imageElement.src = poi.imageUrl;

    } else {
        imageElement.src = 'https://via.placeholder.com/800x300?text=Không+có+hình+ảnh';

    }
}

// Hiển thị error state
function showError() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('poiDetail').classList.add('d-none');
    document.getElementById('error').classList.remove('d-none');
}

// Quay lại trang trước
function goBack() {
    window.history.back();
}

// Chạy khi trang load
document.addEventListener('DOMContentLoaded', loadPoiDetail);