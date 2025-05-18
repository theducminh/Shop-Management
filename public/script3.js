const API_URL3 = 'http://localhost:3000/Customers';

let oldCustomerId = null;
// Lấy toàn bộ danh sách khách hàng
async function fetchCustomers() {
  try {
    const res = await fetch(API_URL3);
    const customers = await res.json();
    renderCustomerTable(customers);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách hàng:', err);
  }
}

//Hiển thị danh sách khách hàng
function renderCustomerTable(customers) {
  const tableBody = document.getElementById('customerTableBody');
  tableBody.innerHTML = '';

  customers.forEach((customer, index) => {
   const row = `
      <tr>
        <td class="border p-2">${index + 1}</td>
        <td class="border p-2">${customer.customer_id}</td>
        <td class="border p-2">${customer.name}</td>
        <td class="border p-2">${customer.email}</td>
        <td class="border p-2">${customer.phone}</td> 
        <td class="border p-2">${customer.address}</td>
        <td class="border p-2">
          <button class="bg-yellow-400 px-2 py-1 rounded mr-2" onclick="editCustomer('${customer.customer_id}')">Sửa</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteCustomer('${customer.customer_id}')">Xóa</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;   
   
  });
}

// Thêm hoặc cập nhật khách hàng
async function saveCustomer(event) {
  event.preventDefault();

  const customer_id = document.getElementById('customer_id').value;
  const name = document.getElementById('customerName').value;
  const email = document.getElementById('customerEmail').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  if (!name || !email || !phone || !address || !customer_id) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const data = { customer_id, name, email, phone, address };

  try {
    let res;
    if (oldCustomerId) {
      res = await fetch(`${API_URL3}/${oldCustomerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch(API_URL3, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    if (res.ok) {
      alert('Khách hàng đã được lưu thành công!');
      closeForm('customerForm');
      fetchCustomers();

      oldCustomerId = null; // Reset oldCustomerId after saving

    } else {
      alert('Đã xảy ra lỗi khi lưu khách hàng.');
    }
  } catch (err) {
    console.error('Lỗi khi lưu khách hàng:', err);
  }
}

// Xóa khách hàng
async function deleteCustomer(customer_id) {
  if (confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
    try {
      const res = await fetch(`${API_URL3}/${customer_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Khách hàng đã được xóa thành công!');
        fetchCustomers();
      } else {
        alert('Đã xảy ra lỗi khi xóa khách hàng.');
      }
    } catch (err) {
      console.error('Lỗi khi xóa khách hàng:', err);
    }
  }
}

// Chỉnh sửa thông tin khách hàng
async function editCustomer(customer_id){
    try{
        const res = await fetch(`${API_URL3}/${customer_id}`);
        const customer = await res.json();
        

        if (res.ok) {
            document.getElementById('customer_id').value = customer.customer_id;
            document.getElementById('customerName').value = customer.name;
            document.getElementById('customerEmail').value = customer.email;
            document.getElementById('customerPhone').value = customer.phone;
            document.getElementById('customerAddress').value = customer.address;
            oldCustomerId = customer.customer_id; // Lưu ID cũ để cập nhật
            showForm('customerForm');
        }
        else{
            alert('Đã xảy ra lỗi khi lấy thông tin khách hàng.');
            return;
        }
    } catch(err){
        console.error('Lỗi khi lấy thông tin khách hàng:', err);
        alert('Đã xảy ra lỗi khi lấy chỉnh sửa khách hàng.');
    }
}

//Tim kiếm khách hàng
async function searchCustomer() {
  const searchValue = document.getElementById('customerSearch').value.toLowerCase();
  try {
    const res = await fetch(API_URL3);
    const customers = await res.json();
    const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchValue)
    );
    renderCustomerTable(filteredCustomers);
  } catch (err) {
    console.error('Lỗi khi tìm kiếm khách hàng:', err);
  }
}

//Gắn sự kiện 
document.addEventListener('DOMContentLoaded', () => {
  fetchCustomers();

  const searchInput = document.querySelector('input[placeholder*="Tìm kiếm khách hàng"]');
  if (searchInput) {
    searchInput.id = 'customerSearch';
    searchInput.addEventListener('input', searchCustomer);
  }

  document.getElementById('formCustomer')?.addEventListener('submit', saveCustomer);
});
