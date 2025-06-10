document
  .getElementById("poiForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const poiData = {
      name: document.getElementById("name").value.trim(),
      typename: document.getElementById("typename").value,
      address: document.getElementById("address").value.trim(),
      openTime: document.getElementById("openTime").value,
      closeTime: document.getElementById("closeTime").value,
      price: parseFloat(document.getElementById("price").value) || 0,
      imageUrl: document.getElementById("imageUrl").value.trim(),
      description: document.getElementById("description").value.trim(),
    };

    // Validate required fields
    if (!poiData.name || !poiData.typename) {
      alert("Vui lòng nhập tên POI và chọn loại POI!");
      return;
    }

    try {
      const response = await fetch("https://quanhne.id.vn/api/onepoi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poiData),
      });

      if (response.ok) {
        alert("Thêm POI thành công!");
        window.location.href = "pois.html"; // Quay về danh sách
      } else {
        alert("Lỗi khi thêm POI!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối!");
    }
  });

function goBack() {
  window.history.back();
}
