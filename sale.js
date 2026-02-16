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
    // Set default dates to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateFrom').value = today;
    document.getElementById('dateTo').value = today;

    // Theme Toggle Persistence
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    generateReport(); // Initial Load
});

function generateReport() {
    const tbody = document.getElementById('salesTableBody');
    // Simulation: Internal Link would pull from 'orderHistory' localStorage key
    const mockData = [
        { sno: 1, acc: 1, date: "09-Jan-2021", cust: "ALI", addr: "Lakrachi", phone: "+9231234567", status: "Active", prod: "19 LTR", price: 80, sale: 5, ret: 0, bill: 400 },
        { sno: 2, acc: 1, date: "09-Jan-2021", cust: "ALI", addr: "Lakrachi", phone: "+9231234567", status: "Active", prod: "600 ML", price: 80, sale: 20, ret: 0, bill: 1600 }
    ];

    tbody.innerHTML = "";
    mockData.forEach((row, index) => {
        const tr = document.createElement('tr');
        if(index === 0) tr.classList.add('selected-row'); // Match image highlight
        tr.innerHTML = `
            <td>${row.sno}</td>
            <td>${row.acc}</td>
            <td>${row.date}</td>
            <td><strong>${row.cust}</strong></td>
            <td>${row.addr}</td>
            <td>${row.phone}</td>
            <td style="color:green">${row.status}</td>
            <td>${row.prod}</td>
            <td>${row.price}</td>
            <td>${row.sale}</td>
            <td>${row.ret}</td>
            <td><b>${row.bill}</b></td>
        `;
        tbody.appendChild(tr);
    });

    // Update Totals Logic
    document.getElementById('totalSale').value = 25;
    document.getElementById('dispFrom').innerText = document.getElementById('dateFrom').value;
    document.getElementById('dispTo').innerText = document.getElementById('dateTo').value;
}