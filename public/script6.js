const API_URL6 = 'http://localhost:3000/OrderDetails';

let currentOrderId = null;
let oldDetailId = null; // để sửa chi tiết

// Hiển thị bảng chi tiết đơn hàng theo order_id
async function showOrderDetails(order_id) {
  currentOrderId = order_id;
  document.getElementById('orderDetailsTitle').innerText = `Chi tiết đơn hàng: ${order_id}`;
  await fetchOrderDetails(order_id);
  showForm('orderDetails'); // hiện section chi tiết (bạn cần chuẩn bị HTML)
}

//Lấy danh sách chi tiết đơn hàng
async function fetchOrderDetails(order_id) {
  try {
    const res = await fetch(`${API_URL6}/${order_id}`);
    const orderDetails = await res.json();
    renderOrderDetailTable(orderDetails);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách chi tiết đơn hàng:', err);
  }
}

// Hiển thị bảng chi tiết đơn hàng
function renderOrderDetailTable(orderDetails) {
  const tableBody = document.getElementById('orderDetailTableBody');
  tableBody.innerHTML = ''; // Xóa nội dung cũ

  orderDetails.forEach((detail, index) => {
    const row = `
      <tr>
        <td class="border p-2">${index + 1}</td>
        <td class="border p-2">${detail.order_id}</td>
        <td class="border p-2">${detail.product_id}</td>
        <td class="border p-2">${detail.quantity}</td>
        <td class="border p-2">${detail.price}</td>
        <td class="border p-2">
          <button class="bg-yellow-400 px-2 py-1 rounded mr-2" onclick="editOrderDetail('${detail.order_id}', '${detail.product_id}')">Sửa</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteOrderDetail(${detail.id})">Xóa</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Thêm hoặc cập nhật chi tiết đơn hàng

async function saveOrderDetail(event) {
  event.preventDefault();

  const order_id = document.getElementById('orderid').value;
  const product_id = document.getElementById('productid').value;
  const quantity = document.getElementById('quantity').value;
  const price = document.getElementById('price').value;

  if(!order_id || !product_id || !quantity || !price){
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const data = { order_id, product_id, quantity, price };
  try {
    let res;
    if (oldDetailId) {
      res = await fetch(`${API_URL6}/${oldDetailId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch(API_URL6, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    if (res.ok) {
      alert('Chi tiết đơn hàng đã được lưu thành công!');
      closeForm('orderdetailForm');
      await fetchOrderDetails(currentOrderId);
      await fetchOrders(); // Cập nhật lại danh sách đơn hàng nếu cần
     

      oldDetailId = null; // Reset oldDetailId sau khi lưu
    } else {
      alert('Lỗi khi lưu chi tiết đơn hàng!');
    }
  } catch (err) {
    console.error('Lỗi khi lưu chi tiết đơn hàng:', err);
  }
}

// Xóa chi tiết đơn hàng
async function deleteOrderDetail(id) {
  if (confirm('Bạn có chắc chắn muốn xóa chi tiết đơn hàng này không?')) {
    try {
      const res = await fetch(`${API_URL6}/${id}`, {
        method: 'DELETE',
      });
      console.log('Status code:', res.status);  // Log mã trạng thái
      const result = await res.json();
        alert('Chi tiết đơn hàng đã được xóa thành công!');
        await fetchOrderDetails(currentOrderId);
        await fetchOrders(); // Cập nhật lại danh sách đơn hàng nếu cần
      
    } catch (err) {
      console.error('Lỗi khi xóa chi tiết đơn hàng(2):', err);
    }
  }
}

//Chỉnh sửa chi tiết đơn hàng
async function editOrderDetail(order_id, product_id) {
  try {
    const res = await fetch(`${API_URL6}/${order_id}/${product_id}`);
    const orderDetail = await res.json();
    if (res.ok) {
      document.getElementById('orderid').value = orderDetail.order_id;
      document.getElementById('productid').value = orderDetail.product_id;
      document.getElementById('quantity').value = orderDetail.quantity;
      document.getElementById('price').value = orderDetail.price;

      oldDetailId = `${order_id}/${product_id}`; // Lưu lại ID cũ để sửa
      showForm('orderdetailForm');
    } else {
      alert('Lỗi khi lấy thông tin chi tiết đơn hàng!');
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin chi tiết đơn hàng:', err);
  }
}

// gắn sự kiện 
document.addEventListener('DOMContentLoaded', () => {
  
    document.getElementById('orderDetailForm')?.addEventListener('submit', saveOrderDetail);
});
