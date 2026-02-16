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

    // 1. Theme Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // 2. Default Date
    document.getElementById('vDate').valueAsDate = new Date();

    // 3. Save Vendor Data
    const vForm = document.getElementById('vendorForm');
    vForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const vendor = {
            id: Date.now(),
            acc: Math.floor(100 + Math.random() * 900), // Simulated Acc#
            date: document.getElementById('vDate').value,
            name: document.getElementById('vName').value.toUpperCase(),
            phone: document.getElementById('vPhone').value,
            address: document.getElementById('vAddress').value,
            remarks: document.getElementById('vRemarks').value,
            balance: document.getElementById('vBalance').value
        };

        // Get existing data
        let list = JSON.parse(localStorage.getItem('vendorDB')) || [];
        list.push(vendor);
        
        // Save to Storage
        localStorage.setItem('vendorDB', JSON.stringify(list));

        alert("✅ New Vendor Saved to Database!");
        vForm.reset();
        document.getElementById('vDate').valueAsDate = new Date();
        loadVendors();
    });
});

// 4. Load Data into Table
function loadVendors(filteredData = null) {
    const list = filteredData || JSON.parse(localStorage.getItem('vendorDB')) || [];
    const tbody = document.getElementById('vendorTableBody');
    tbody.innerHTML = "";

    list.forEach((v, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.acc}</td>
            <td>${v.date}</td>
            <td><strong>${v.name}</strong></td>
            <td>${v.address}</td>
            <td>+92 ${v.phone}</td>
            <td style="font-weight:700;">${v.balance}</td>
        `;

        // Row Selection Logic (Matches Blue Highlight in image)
        row.onclick = () => {
            document.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
            row.classList.add('selected-row');
            
            // Populate form for Edit simulation
            document.getElementById('vName').value = v.name;
            document.getElementById('vAddress').value = v.address;
            document.getElementById('vPhone').value = v.phone;
            document.getElementById('vBalance').value = v.balance;
            document.getElementById('vRemarks').value = v.remarks;
        };

        tbody.appendChild(row);
    });
}

// 5. Search Logic
function searchVendor() {
    const query = document.getElementById('vSearch').value.toLowerCase();
    const list = JSON.parse(localStorage.getItem('vendorDB')) || [];
    
    const filtered = list.filter(v => 
        v.name.toLowerCase().includes(query) || 
        v.acc.toString().includes(query)
    );
    
    loadVendors(filtered);
}

function editMode() {
    alert("📝 Row Data loaded into form. Modify fields and click New Vendor to Save changes (Simulation).");
}