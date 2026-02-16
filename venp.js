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
    loadVendors();
    document.getElementById('pDate').valueAsDate = new Date();

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    // Handle Payment Submission
    const payForm = document.getElementById('paymentForm');
    payForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const vAcc = document.getElementById('accNo').value;
        const amount = parseFloat(document.getElementById('pAmount').value);

        if (!vAcc || !amount) return alert("Select a Vendor and enter Amount!");

        // 1. Update Vendor Balance in Database (Internal Linking)
        let vendors = JSON.parse(localStorage.getItem('vendorDB')) || [];
        const index = vendors.findIndex(v => v.accNo.toString() === vAcc);

        if (index !== -1) {
            // Deduct from payable balance
            vendors[index].balance = parseFloat(vendors[index].balance) - amount;
            localStorage.setItem('vendorDB', JSON.stringify(vendors));

            // 2. Save Payment Transaction to History
            let payHistory = JSON.parse(localStorage.getItem('vPaymentLog')) || [];
            payHistory.push({
                acc: vAcc,
                amount: amount,
                date: document.getElementById('pDate').value,
                mode: document.querySelector('input[name="pType"]:checked').value
            });
            localStorage.setItem('vPaymentLog', JSON.stringify(payHistory));

            alert(`💰 PAYMENT SUCCESS!\nVendor: ${vendors[index].name}\nAmount: $${amount}\nLedger Updated.`);
            resetForm();
            loadVendors();
        }
    });
});

// 2. Internal Linking: Load Data from Vendor.html key
function loadVendors() {
    const vendors = JSON.parse(localStorage.getItem('vendorDB')) || [];
    const tbody = document.getElementById('vendorTableBody');
    tbody.innerHTML = "";

    vendors.forEach((v, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.accNo}</td>
            <td><strong>${v.name}</strong></td>
            <td>${v.address}</td>
            <td>${v.phone}</td>
            <td style="color:red; font-weight:bold;">${v.balance}</td>
        `;

        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
            
            // Populate form
            document.getElementById('accNo').value = v.accNo;
            document.getElementById('vName').value = v.name;
            document.getElementById('balAmount').value = v.balance;
            document.getElementById('footerBalance').value = v.balance;

            // Activate button
            document.querySelector('.btn-pay').style.background = "#22c55e";
            document.querySelector('.btn-pay').style.color = "white";
        };
        tbody.appendChild(row);
    });
}

function filterVendors() {
    const val = document.getElementById('vSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#vendorTableBody tr');
    rows.forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(val) ? "" : "none";
    });
}

function resetForm() {
    document.getElementById('paymentForm').reset();
    document.getElementById('pDate').valueAsDate = new Date();
    document.querySelector('.btn-pay').style.background = "#1a364b";
}