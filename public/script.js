                
// Hiển thị tên đăng nhập

const savedUsername = localStorage.getItem("loggedInUsername");
if (savedUsername) {
    document.getElementById("usernameDisplay").innerText = savedUsername;
}

// Toggle dropdown
function toggleDropdown() {
  document.getElementById("accountDropdown").classList.toggle("hidden");
}

// Đăng xuất
function logout() {
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

// Ẩn dropdown khi click ngoài
window.addEventListener("click", function(e) {
  const dropdown = document.getElementById("accountDropdown");
  const button = document.querySelector("#topbar button[onclick='toggleDropdown()']");
  if (!dropdown.contains(e.target) && !button.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});

function showTab(tabId) {
 document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.add('hidden'));
 document.getElementById(tabId).classList.remove('hidden');
}

function showForm(form) {
    if (form === 'employeeForm'){document.getElementById('employeeForm').classList.remove('hidden');
    }
    else if (form === 'productForm'){document.getElementById('productForm').classList.remove('hidden');}
    else if (form === 'supplierForm'){document.getElementById('supplierForm').classList.remove('hidden');}
    else if (form === 'customerForm'){document.getElementById('customerForm').classList.remove('hidden');}
    else if (form === 'orderForm'){document.getElementById('orderForm').classList.remove('hidden');}
    else if (form === 'orderDetailForm'){document.getElementById('orderDetailForm').classList.remove('hidden');}
    else if (form === 'orderDetails'){document.getElementById('orderDetails').classList.remove('hidden');}
    else if (form === 'orderdetailForm'){document.getElementById('orderdetailForm').classList.remove('hidden');}

}

function closeForm(form) {
    if (form === 'employeeForm') {
        document.getElementById('employeeForm').classList.add('hidden');
        document.getElementById('formEmployee').reset();
        document.getElementById('employee_id').value = '';
    } else if (form === 'productForm') {
        document.getElementById('productForm').classList.add('hidden');
        document.getElementById('formProduct').reset();
        document.getElementById('product_id').value = '';
    }
    else if (form === 'supplierForm') {
        document.getElementById('supplierForm').classList.add('hidden');
        document.getElementById('formSupplier').reset();
        document.getElementById('supplier_id').value = '';
    } else if (form === 'customerForm') {
        document.getElementById('customerForm').classList.add('hidden');
        document.getElementById('formCustomer').reset();
        document.getElementById('customer_id').value = '';
    }
    else if (form === 'orderForm') {
        document.getElementById('orderForm').classList.add('hidden');
        document.getElementById('formOrder').reset();
        document.getElementById('order_id').value = '';
    }
    else if (form === 'orderdetailForm') {
        document.getElementById('orderdetailForm').classList.add('hidden');
        document.getElementById('formOrderDetail').reset();
        document.getElementById('orderid').value = '';
    }
    else if (form === 'orderDetails') {
        document.getElementById('orderDetails').classList.add('hidden');
        document.getElementById('order_id').value = '';
    }
 
 }