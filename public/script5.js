const API_URL2 = 'http://localhost:3000/Orders';

let oldOrderId = null;

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
  const orderTableBody = document.getElementById('orderTableBody');
  orderTableBody.innerHTML = '';

  orders.forEach((order, index) => {
    const row = `
      <tr>
        <td class="border p-2">${index + 1}</td>
        <td class="border p-2">${order.order_id}</td>
        <td class="border p-2">${order.customer_id}</td>
        <td class="border p-2">${order.order_date}</td>
        <td class="border p-2">${order.status}</td>
        <td class="border p-2">${order.total_price}</td>
        <td class="border p-2">
          <button class="bg-blue-500 text-white px-2 py-1 rounded mr-2" onclick="showOrderDetails('${order.order_id}')">Chi tiết</button>
          <button class="bg-yellow-400 px-2 py-1 rounded mr-2" onclick="editOrder('${order.order_id}')">Sửa</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteOrder('${order.order_id}')">Xóa</button>
        </td>
      </tr>
    `;
    orderTableBody.innerHTML += row;
  });

  
}

  // thêm hoăc cập nhật đơn hàng
  async function saveOrder(event) {
    event.preventDefault();

    const order_id = document.getElementById('order_id').value;
    const customer_id = document.getElementById('customerCode').value;
    const order_date = document.getElementById('orderDate').value;
    const status = document.getElementById('orderStatus').value;
    const total_price = document.getElementById('totalPrice').value;

    if(!order_id || !customer_id || !order_date || !status || !total_price){
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const data = { order_id, customer_id, order_date, status, total_price };
    try {
      let res;
      if (oldOrderId) {
        res = await fetch(`${API_URL2}/${oldOrderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch(API_URL2, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }
      if (res.ok) {
        alert('Lưu đơn hàng thành công!');
        fetchOrders();
        closeForm('orderForm');

        oldOrderId = null; // Reset oldOrderId
      } else {
        alert('Lỗi khi lưu đơn hàng!');
      }
    } catch (err) {
      console.error('Lỗi khi lưu đơn hàng:', err);
    }
  }

    // Xóa đơn hàng
    async function deleteOrder(order_id) {
      if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
        try {
          const res = await fetch(`${API_URL2}/${order_id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            alert('Đơn hàng đã được xóa thành công!');
            fetchOrders();
          } else {
            alert('Lỗi khi xóa đơn hàng!');
          }
        } catch (err) {
          console.error('Lỗi khi xóa đơn hàng:', err);
        }
      }
    }

    // Chỉnh sửa thông tin đơn hàng
    async function editOrder(order_id) {
      try {
        const res = await fetch(`${API_URL2}/${order_id}`);
        const order = await res.json();
        if (res.ok) {
          document.getElementById('order_id').value = order.order_id;
          document.getElementById('customerCode').value = order.customer_id;
          document.getElementById('orderDate').value = order.order_date;
          document.getElementById('orderStatus').value = order.status;
          document.getElementById('totalPrice').value = order.total_price;
          oldOrderId = order.order_id; // Set oldOrderId for updating
          showForm('orderForm');
        } else {
          alert('Lỗi khi lấy thông tin đơn hàng!');
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', err);
      }
    }

  // Tìm kiếm đơn hàng
  async function searchOrders() {
    const searchValue = document.getElementById('orderSearch').value.toLowerCase();
    try {
      const res = await fetch(API_URL2);
      const orders = await res.json();
      const filteredOrders = orders.filter(order => 
        order.order_id.toLowerCase().includes(searchValue) 
      );
      renderOrderTable(filteredOrders);
    } catch (err) {
      console.error('Lỗi khi tìm kiếm đơn hàng:', err);
    }
  }

  // gắn sự kiện
  document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();

    const searchInput = document.querySelector('input[placeholder*="Tìm kiếm đơn hàng"]');
    if (searchInput) {
      searchInput.id = 'orderSearch';
      searchInput.addEventListener('input', searchOrders);
    }

    document.getElementById('formOrder')?.addEventListener('submit', saveOrder);
  });