const API_URL2 = 'http://localhost:3000/Orders';

// Lây danh sách đơn hàng
async function fetchOrders() {
  try {
    const res = await fetch(API_URL2);
    const orders = await res.json();
    renderOrderTable(orders);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
  }
}

// Hiển thị danh sách đơn hàng
function renderOrderTable(orders) {
  const orderTable = document.getElementById('orderTable');
  orderTable.innerHTML = '';

  orders.forEach((order) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.order_id}</td>
      <td>${order.customer_id}</td>
      <td>${order.product_id}</td>
      <td>${order.quantity}</td>
      <td>${order.order_date}</td>
      <td>
        <button onclick="editOrder(${order.order_id})">Sửa</button>
        <button onclick="deleteOrder(${order.order_id})">Xóa</button>
      </td>
    `;
    orderTable.appendChild(row);
  });
}