// Example for Prod.html
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = "2"; // This would come from your login session
    const permissions = JSON.parse(localStorage.getItem(`userRoles_${currentUser}`));

    // If 'add-prod' checkbox was unchecked, block access
    if (permissions && permissions['add-prod'] === false) {
        document.body.innerHTML = "<h1 style='text-align:center; margin-top:20%; color:red;'>🚫 ACCESS DENIED: You do not have permission to view this section.</h1>";
        setTimeout(() => window.location.href = 'produ.html', 2000);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        themeBtn.innerHTML = next === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
});

function toggleDateVisibility() {
    const type = document.getElementById('ledgerType').value;
    document.getElementById('dateFilters').style.display = type.includes('range') ? 'block' : 'none';
}

// 2. Search Logic: Link to Vendor Database
function searchVendor() {
    const idInput = document.getElementById('vSearchId').value;
    const vendorDB = JSON.parse(localStorage.getItem('vendorDB')) || [];
    
    const vendor = vendorDB.find(v => v.accNo.toString() === idInput || v.name.toLowerCase().includes(idInput.toLowerCase()));

    if (vendor) {
        document.getElementById('dispId').value = vendor.accNo;
        document.getElementById('dispName').value = vendor.name;
        document.getElementById('sideVName').value = vendor.name;
        document.getElementById('dispAddr').value = vendor.address;
        document.getElementById('dispContact').value = vendor.phone;
        document.getElementById('topBalance').value = vendor.balance;
        alert("✅ Vendor record loaded.");
    } else {
        alert("❌ Vendor not found. Ensure you added them in the Vendor page.");
    }
}

// 3. Output Logic: Merge Purchase History & Payments
function generateLedgerOutput() {
    const vId = document.getElementById('dispId').value;
    if(!vId) return alert("Search a vendor first!");

    const tbody = document.getElementById('ledgerOutputBody');
    tbody.innerHTML = ""; 

    // Internal Links to other pages' data
    const purchases = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    const payments = JSON.parse(localStorage.getItem('vPaymentLog')) || [];

    let totalBilling = 0;
    let totalPaid = 0;

    // Filter data for this specific vendor
    const vendorPurchases = purchases.filter(p => p.vendor.includes(document.getElementById('dispName').value));
    const vendorPayments = payments.filter(p => p.acc.toString() === vId.toString());

    // Render Purchases (Blue Rows like image)
    vendorPurchases.forEach((p, i) => {
        totalBilling += parseFloat(p.total);
        tbody.innerHTML += `<tr style="background:#0078D7; color:white; font-weight:bold;">
            <td>${i + 1}</td>
            <td>${p.date}</td>
            <td>${p.id}</td>
            <td>${p.billNo || '-'}</td>
            <td>Inward Stock</td>
            <td>-</td>
            <td>-</td>
            <td>${p.total}</td>
            <td>0</td>
        </tr>`;
    });

    // Render Payments (Yellow Rows like image)
    vendorPayments.forEach((py, i) => {
        totalPaid += parseFloat(py.amount);
        tbody.innerHTML += `<tr style="background:#fff9c4;">
            <td>${vendorPurchases.length + i + 1}</td>
            <td>${py.date}</td>
            <td>PAY-${py.acc}</td>
            <td>-</td>
            <td>Cash Payment</td>
            <td>-</td>
            <td>-</td>
            <td>0</td>
            <td>${py.amount}</td>
        </tr>`;
    });

    // Final Footer Calculation Output
    document.getElementById('outBillAmt').value = totalBilling.toFixed(2);
    document.getElementById('outTotalAmt').value = totalBilling.toFixed(2);
    document.getElementById('outPaid').value = totalPaid.toFixed(2);
    document.getElementById('outFinalBal').value = (totalBilling - totalPaid).toFixed(2);
}