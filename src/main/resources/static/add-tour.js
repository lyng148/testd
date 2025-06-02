document.getElementById('tourForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const tourData = {
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
        const response = await fetch('https://testd-ii75.onrender.com/api/tour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert('Thêm tour thành công!');
            window.location.href = 'index.html'; // Quay về trang chủ
        } else {
            alert('Lỗi khi thêm tour!');
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

function goBack() {
    window.location.href = 'index.html';
}