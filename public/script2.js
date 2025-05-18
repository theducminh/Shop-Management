const API_URL1 = 'http://localhost:3000/Products';

let oldProductId = null;

// Lấy toàn bộ danh sách sản phẩm
async function fetchProducts() {
  try {
    const res = await fetch(API_URL1);
    const products = await res.json();
    renderProductTable(products);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', err);
  }
}

// Hiển thị bảng sản phẩm
function renderProductTable(products) {
  const tbody = document.getElementById('productTableBody');
  tbody.innerHTML = '';
  products.forEach((prod, idx) => {
    const row = `
      <tr>
        <td class="border p-2">${idx + 1}</td>
        <td class="border p-2">${prod.product_id}</td>
        <td class="border p-2">${prod.name}</td>
        <td class="border p-2">${prod.description}</td>
        <td class="border p-2">${prod.price}</td>
        <td class="border p-2">${prod.quantity}</td>
        <td class="border p-2">${prod.supplier_id}</td>
        <td class="border p-2">
          <button class="bg-yellow-400 px-2 py-1 rounded mr-2" onclick="editProduct('${prod.product_id}')">Sửa</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteProduct('${prod.product_id}')">Xóa</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

//
// Thêm hoặc cập nhật sản phẩm
async function saveProduct(event) {
  event.preventDefault();

  const product_id = document.getElementById('product_id').value;
  const name = document.getElementById('productName').value;
  const description = document.getElementById('productDescription').value;
  const price = document.getElementById('productPrice').value;
  const quantity = document.getElementById('productQuantity').value;
  const supplier_id = document.getElementById('productSupplier_id').value;

  if (!name || !description || !price || !quantity || !supplier_id || !product_id) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const data = { product_id, name, description, price, quantity, supplier_id };

  try {
    let res;
    if (oldProductId) {
      res = await fetch(`${API_URL1}/${oldProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch(API_URL1, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    const result = await res.json();

    if (res.ok) {
      alert(result.message);
      closeForm('productForm');
      fetchProducts();
      oldProductId = null; // Reset oldProductId after saving
    } else {
      alert('Lỗi khi lưu sản phẩm!' || result.message);
    }
  } catch (err) {
    console.error('Lỗi khi lưu sản phẩm:', err);
  }
}

//Xoá sản phẩm
async function deleteProduct(product_id) {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
    try {
      const res = await fetch(`${API_URL1}/${product_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Sản phẩm đã được xóa thành công!');
        fetchProducts();
      } else {
        alert('Lỗi khi xóa sản phẩm!');
      }
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
    }
  }
}

// Chỉnh sửa sản phẩm
async function editProduct(product_id) {
  try {
    const res = await fetch(`${API_URL1}/${product_id}`);
    const product = await res.json();
    if (res.ok) {
      document.getElementById('product_id').value = product.product_id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productQuantity').value = product.quantity;
      document.getElementById('productSupplier_id').value = product.supplier_id;
      oldProductId = product.product_id; // Set oldProductId for update
      showForm('productForm');
    } else {
      alert('Lỗi khi lấy thông tin sản phẩm!');
    }
  } catch (err) {
    console.error('Lỗi khi chỉnh sửa sản phẩm:', err);
  }
}

// Tìm kiếm sản phẩm
async function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  try {
    const res = await fetch(API_URL1);
    const products = await res.json();
    const filteredProducts = products.filter(prod => prod.name.toLowerCase().includes(searchTerm));
    renderProductTable(filteredProducts);
  } catch (err) {
    console.error('Lỗi khi tìm kiếm sản phẩm:', err);
  }
}

// Gắn sự kiện
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const searchInput = document.querySelector('input[placeholder*="Tìm kiếm sản phẩm"]');
  if (searchInput) {
    searchInput.id = 'searchInput';
    searchInput.addEventListener('input', searchProducts);
  }

  document.getElementById('formProduct')?.addEventListener('submit', saveProduct);
});
