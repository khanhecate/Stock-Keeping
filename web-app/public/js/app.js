/**
 * Main Web Application Logic
 * Sistem Inventaris & Ruangan Kantor
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let currentUser = null;
let currentView = 'dashboard';

function initApp() {
    checkAuth();
    initTheme();
    initNavigation();
    initModals();
    checkDbStatus();

    // Default view
    loadView('dashboard');
}

/* ==========================================================================
   AUTHENTICATION & SESSION & PERMISSIONS (SYNOLOGY NAS GROUP RBAC)
   ========================================================================== */

const ALL_PERMISSION_KEYS = [
    'menu_dashboard', 'menu_master', 'menu_transaksi', 'menu_laporan', 'menu_akses',
    'sub_asset', 'sub_category', 'sub_room', 'sub_location', 'sub_status', 'sub_supplier',
    'sub_loan', 'sub_outbound', 'sub_booking', 'sub_stock_opname',
    'sub_report_history', 'sub_report_loan', 'sub_report_booking',
    'sub_user_list', 'sub_access_list'
];

function checkAuth() {
    const storedUser = localStorage.getItem('inventory_user');
    if (!storedUser) {
        // Auto default to IT Administrator
        currentUser = {
            userId: 1,
            username: 'admin',
            name: 'Administrator IT',
            divisi: 'Information Technology',
            level: 'Administrator',
            role: 'Admin',
            permissions: ALL_PERMISSION_KEYS
        };
        localStorage.setItem('inventory_user', JSON.stringify(currentUser));
    } else {
        currentUser = JSON.parse(storedUser);
        if (!currentUser.permissions || currentUser.permissions.length === 0) {
            if (currentUser.level === 'Administrator' || (currentUser.divisi && currentUser.divisi.toLowerCase().includes('information technology'))) {
                currentUser.permissions = ALL_PERMISSION_KEYS;
            }
        }
    }

    // Update UI User display
    const userNameEl = document.getElementById('currentUserName');
    const userRoleEl = document.getElementById('currentUserRole');
    const userAvatarEl = document.getElementById('currentUserAvatar');

    if (userNameEl) userNameEl.textContent = currentUser.name || currentUser.username;
    if (userRoleEl) {
        userRoleEl.textContent = currentUser.divisi ? `${currentUser.divisi} (${currentUser.level || 'Staff'})` : (currentUser.role || 'Staff');
    }
    if (userAvatarEl) {
        userAvatarEl.textContent = (currentUser.name || currentUser.username).charAt(0).toUpperCase();
    }

    applyUserPermissions(currentUser.permissions);
}

function applyUserPermissions(permissions) {
    if (!permissions || !Array.isArray(permissions)) {
        permissions = [];
    }

    const isSuperAdmin = currentUser && (
        currentUser.level === 'Administrator' ||
        (currentUser.divisi && currentUser.divisi.toLowerCase().includes('information technology')) ||
        currentUser.role === 'Admin'
    );

    // Filter all nav items with data-perm
    const navItems = document.querySelectorAll('.nav-item[data-perm]');
    navItems.forEach(item => {
        const permKey = item.getAttribute('data-perm');
        if (isSuperAdmin || permissions.includes(permKey)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    // Check parent nav-section headers with data-group
    const navSections = document.querySelectorAll('.nav-section[data-group]');
    navSections.forEach(section => {
        const visibleItems = Array.from(section.querySelectorAll('.nav-item[data-perm]')).filter(
            el => el.style.display !== 'none'
        );
        if (visibleItems.length > 0) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
        localStorage.removeItem('inventory_user');
        window.location.reload();
    }
}

/* ==========================================================================
   THEME TOGGLING (DARK / LIGHT)
   ========================================================================== */

function initTheme() {
    const savedTheme = localStorage.getItem('inventory_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('inventory_theme', next);
        });
    }
}

/* ==========================================================================
   DATABASE STATUS CHECKER
   ========================================================================== */

async function checkDbStatus() {
    const pill = document.getElementById('dbStatusPill');
    const text = document.getElementById('dbStatusText');
    if (!pill || !text) return;

    try {
        const res = await API.get('/auth/profile');
        if (res.isDbConnected) {
            pill.className = 'db-status-pill online';
            text.textContent = 'MySQL Online';
        } else {
            pill.className = 'db-status-pill offline';
            text.textContent = 'Mode Offline (Demo)';
        }
    } catch (e) {
        pill.className = 'db-status-pill offline';
        text.textContent = 'Server Offline';
    }
}

/* ==========================================================================
   NAVIGATION & VIEW SWITCHER
   ========================================================================== */

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            loadView(view);

            // Update active sidebar nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function loadView(viewName) {
    currentView = viewName;

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

    // Show target section
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
        target.classList.add('active');
    }

    // Update topbar title
    const titleEl = document.getElementById('pageTitle');
    const descEl = document.getElementById('pageDesc');

    const titles = {
        'dashboard': ['Dashboard Utama', 'Ringkasan operasional dan status inventaris terkini'],
        'assets': ['Data Aset & Barang', 'Kelola data inventaris, spesifikasi, dan barcode aset'],
        'categories': ['Kategori Barang', 'Kelompokkan barang berdasarkan jenis dan tipe aset/habis pakai'],
        'rooms': ['Ruang Pertemuan / Rapat', 'Daftar ruangan rapat yang tersedia untuk reservasi kantor'],
        'locations': ['Lokasi Penyimpanan', 'Daftar gedung, lantai, dan ruang penyimpanan inventaris'],
        'statuses': ['Status Inventaris', 'Pengaturan label status ketersediaan barang'],
        'suppliers': ['Data Supplier / Vendor', 'Daftar penyedia barang dan kontak vendor resmi'],
        'loans': ['Peminjaman Barang', 'Pencatatan sirkulasi peminjaman dan pengembalian aset'],
        'outbounds': ['Barang Keluar (Outbound)', 'Pencatatan pengeluaran barang habis pakai atau mutasi'],
        'bookings': ['Booking Ruangan Rapat', 'Jadwal pemesanan ruangan dan pencegahan tabrakan jam'],
        'stock-opname': ['Stock Opname', 'Audit berkala komparasi stok fisik riil dengan sistem'],
        'reports': ['Laporan & Cetak Dokumen', 'Pusat ekspor Excel dan cetak fisik dokumen resmi'],
        'users': ['Manajemen Pengguna & Divisi', 'Kelola data pengguna dan penugasan divisi / grup hak akses (Synology NAS RBAC)'],
        'access': ['List Akses & Hak Akses Divisi', 'Atur hak akses menu & submenu berdasarkan divisi kerja kantor']
    };

    if (titles[viewName]) {
        if (titleEl) titleEl.textContent = titles[viewName][0];
        if (descEl) descEl.textContent = titles[viewName][1];
    }

    // Load data for the active view
    switch (viewName) {
        case 'dashboard': loadDashboardData(); break;
        case 'assets': loadAssetsData(); break;
        case 'categories': loadCategoriesData(); break;
        case 'rooms': loadRoomsData(); break;
        case 'locations': loadLocationsData(); break;
        case 'statuses': loadStatusesData(); break;
        case 'suppliers': loadSuppliersData(); break;
        case 'loans': loadLoansData(); break;
        case 'outbounds': loadOutboundsData(); break;
        case 'bookings': loadBookingsData(); break;
        case 'stock-opname': loadStockOpnameData(); break;
        case 'reports': loadReportsData(); break;
        case 'users': loadUsersData(); break;
        case 'access': loadAccessData(); break;
    }
}

/* ==========================================================================
   1. DASHBOARD MODULE
   ========================================================================== */

async function loadDashboardData() {
    const res = await API.get('/stats/dashboard');
    if (!res.success) return;

    const { stats, recentLoans, upcomingBookings, categoryStats } = res;

    // Stat cards
    document.getElementById('statTotalAssets').textContent = stats.totalAssets || 0;
    document.getElementById('statTotalQty').textContent = (stats.totalQuantity || 0) + ' item';
    document.getElementById('statActiveLoans').textContent = stats.activeLoans || 0;
    document.getElementById('statTodayBookings').textContent = stats.todayBookings || 0;
    document.getElementById('statLowStock').textContent = stats.lowStock || 0;

    // Category breakdown list
    const catContainer = document.getElementById('dashCategoryList');
    if (catContainer && categoryStats) {
        if (categoryStats.length === 0) {
            catContainer.innerHTML = '<p class="text-muted" style="font-size:13px;">Belum ada kategori terdaftar.</p>';
        } else {
            catContainer.innerHTML = categoryStats.map(c => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border);">
                    <div>
                        <div style="font-weight:600; font-size:13.5px;">${escapeHtml(c.name)}</div>
                        <div style="font-size:11.5px; color:var(--text-muted);">${c.asset_count} Jenis Barang</div>
                    </div>
                    <span class="badge badge-info" style="font-size:12px;">${c.total_stock} unit</span>
                </div>
            `).join('');
        }
    }

    // Recent loans table
    const loanTableBody = document.querySelector('#dashRecentLoansTable tbody');
    if (loanTableBody && recentLoans) {
        if (recentLoans.length === 0) {
            loanTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Tidak ada transaksi peminjaman terbaru.</td></tr>';
        } else {
            loanTableBody.innerHTML = recentLoans.map(l => `
                <tr>
                    <td><strong>${escapeHtml(l.pic_name)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(l.division)}</small></td>
                    <td><span class="barcode-badge">${escapeHtml(l.barcode_code)}</span> ${escapeHtml(l.asset_name)}</td>
                    <td>${l.loan_date}</td>
                    <td>${getStatusBadge(l.status)}</td>
                </tr>
            `).join('');
        }
    }

    // Upcoming Bookings
    const bookingList = document.getElementById('dashUpcomingBookings');
    if (bookingList && upcomingBookings) {
        if (upcomingBookings.length === 0) {
            bookingList.innerHTML = '<p class="text-muted" style="font-size:13px;">Tidak ada agenda rapat terjadwal hari ini.</p>';
        } else {
            bookingList.innerHTML = upcomingBookings.map(b => `
                <div style="background-color:var(--bg-subtle); padding:14px; border-radius:var(--radius-md); margin-bottom:10px; border-left:3px solid var(--primary);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <strong style="font-size:13.5px;">${escapeHtml(b.room_name)}</strong>
                        <span class="badge badge-success" style="font-size:11px;">${b.status}</span>
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary); margin-bottom:4px;">
                        ⏰ ${b.start_time.substring(11, 16)} - ${b.end_time.substring(11, 16)} WIB
                    </div>
                    <div style="font-size:12px; color:var(--text-muted);">
                        👤 ${escapeHtml(b.pic_name)} (${escapeHtml(b.division)})
                    </div>
                </div>
            `).join('');
        }
    }
}

/* ==========================================================================
   2. MASTER ASSET MODULE
   ========================================================================== */

let assetsList = [];

async function loadAssetsData() {
    const search = document.getElementById('searchAssetInput')?.value || '';
    const res = await API.get(`/assets?search=${encodeURIComponent(search)}`);
    if (!res.success) return;

    assetsList = res.data || [];
    renderAssetsTable(assetsList);
}

function renderAssetsTable(items) {
    const tbody = document.querySelector('#assetsTable tbody');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <h4>Tidak ada data aset ditemukan</h4>
                        <p>Klik tombol "Tambah Aset Baru" untuk mendaftarkan barang baru.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map((a, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td><span class="barcode-badge">${escapeHtml(a.barcode_code || '-')}</span></td>
            <td>
                <strong>${escapeHtml(a.name)}</strong>
                ${a.specification ? `<br><small style="color:var(--text-muted); font-size:11.5px;">${escapeHtml(a.specification)}</small>` : ''}
            </td>
            <td>${escapeHtml(a.category_name || '-')}</td>
            <td><strong>${a.quantity}</strong> ${escapeHtml(a.unit || 'pcs')}</td>
            <td>${getStatusBadge(a.status)}</td>
            <td>${escapeHtml(a.location_name || '-')}</td>
            <td style="white-space:nowrap;">
                <button class="btn btn-secondary btn-sm" onclick="openEditAssetModal(${a.asset_id})">✏️ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteAsset(${a.asset_id}, '${escapeHtml(a.name)}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

async function openAddAssetModal() {
    document.getElementById('assetForm').reset();
    document.getElementById('assetId').value = '';
    document.getElementById('assetModalTitle').textContent = 'Tambah Aset / Barang Baru';

    // Populate Category, Supplier, Location options
    await populateAssetDropdowns();

    // Auto-generate next barcode code
    const codeRes = await API.get('/assets/next-code');
    if (codeRes.success) {
        document.getElementById('assetBarcode').value = codeRes.code;
    }

    openModal('assetModal');
}

async function openEditAssetModal(id) {
    const asset = assetsList.find(a => a.asset_id == id);
    if (!asset) return;

    await populateAssetDropdowns();

    document.getElementById('assetModalTitle').textContent = 'Ubah Data Aset';
    document.getElementById('assetId').value = asset.asset_id;
    document.getElementById('assetBarcode').value = asset.barcode_code || '';
    document.getElementById('assetName').value = asset.name || '';
    document.getElementById('assetCategory').value = asset.category_id || '';
    document.getElementById('assetSupplier').value = asset.supplier_id || '';
    document.getElementById('assetLocation').value = asset.location_id || '';
    document.getElementById('assetQty').value = asset.quantity || 1;
    document.getElementById('assetUnit').value = asset.unit || 'pcs';
    document.getElementById('assetStatus').value = asset.status || 'Tersedia';
    document.getElementById('assetSpec').value = asset.specification || '';

    openModal('assetModal');
}

async function populateAssetDropdowns() {
    const [cats, sups, locs, stats] = await Promise.all([
        API.get('/categories'),
        API.get('/suppliers'),
        API.get('/locations'),
        API.get('/statuses')
    ]);

    const catSelect = document.getElementById('assetCategory');
    if (catSelect && cats.data) {
        catSelect.innerHTML = '<option value="">-- Pilih Kategori --</option>' +
            cats.data.map(c => `<option value="${c.category_id}">${escapeHtml(c.name)} (${c.type})</option>`).join('');
    }

    const supSelect = document.getElementById('assetSupplier');
    if (supSelect && sups.data) {
        supSelect.innerHTML = '<option value="">-- Tidak Ada / Opsional --</option>' +
            sups.data.map(s => `<option value="${s.supplier_id}">${escapeHtml(s.name)}</option>`).join('');
    }

    const locSelect = document.getElementById('assetLocation');
    if (locSelect && locs.data) {
        locSelect.innerHTML = '<option value="">-- Pilih Lokasi --</option>' +
            locs.data.map(l => `<option value="${l.location_id}">${escapeHtml(l.name)}</option>`).join('');
    }

    const statSelect = document.getElementById('assetStatus');
    if (statSelect && stats.data) {
        statSelect.innerHTML = stats.data.map(st => `<option value="${st.name}">${escapeHtml(st.name)}</option>`).join('');
    }
}

async function handleAssetSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('assetId').value;
    const payload = {
        barcode_code: document.getElementById('assetBarcode').value,
        name: document.getElementById('assetName').value,
        category_id: document.getElementById('assetCategory').value,
        supplier_id: document.getElementById('assetSupplier').value,
        location_id: document.getElementById('assetLocation').value,
        quantity: document.getElementById('assetQty').value,
        unit: document.getElementById('assetUnit').value,
        status: document.getElementById('assetStatus').value,
        specification: document.getElementById('assetSpec').value
    };

    let res;
    if (id) {
        res = await API.put(`/assets/${id}`, payload);
    } else {
        res = await API.post('/assets', payload);
    }

    if (res.success) {
        showToast(res.message, 'success');
        closeModal('assetModal');
        loadAssetsData();
    } else {
        showToast(res.message, 'error');
    }
}

async function confirmDeleteAsset(id, name) {
    if (confirm(`Yakin ingin menghapus aset "${name}"?`)) {
        const res = await API.delete(`/assets/${id}`);
        if (res.success) {
            showToast(res.message, 'success');
            loadAssetsData();
        } else {
            showToast(res.message, 'error');
        }
    }
}

/* ==========================================================================
   3. MASTER CATEGORIES
   ========================================================================== */

let categoriesList = [];

async function loadCategoriesData() {
    const res = await API.get('/categories');
    if (!res.success) return;
    categoriesList = res.data || [];

    const tbody = document.querySelector('#categoriesTable tbody');
    if (!tbody) return;

    tbody.innerHTML = categoriesList.map((c, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(c.name)}</strong></td>
            <td><span class="badge ${c.type === 'ASET' ? 'badge-info' : 'badge-warning'}">${c.type}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openEditCategoryModal(${c.category_id})">✏️ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${c.category_id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function openAddCategoryModal() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Tambah Kategori';
    openModal('categoryModal');
}

function openEditCategoryModal(id) {
    const cat = categoriesList.find(c => c.category_id == id);
    if (!cat) return;
    document.getElementById('categoryModalTitle').textContent = 'Edit Kategori';
    document.getElementById('categoryId').value = cat.category_id;
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categoryType').value = cat.type;
    openModal('categoryModal');
}

async function handleCategorySubmit(e) {
    e.preventDefault();
    const id = document.getElementById('categoryId').value;
    const payload = {
        name: document.getElementById('categoryName').value,
        type: document.getElementById('categoryType').value
    };
    const res = id ? await API.put(`/categories/${id}`, payload) : await API.post('/categories', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('categoryModal');
        loadCategoriesData();
    } else {
        showToast(res.message, 'error');
    }
}

async function deleteCategory(id) {
    if (confirm('Hapus kategori ini?')) {
        const res = await API.delete(`/categories/${id}`);
        if (res.success) {
            showToast(res.message, 'success');
            loadCategoriesData();
        } else {
            showToast(res.message, 'error');
        }
    }
}

/* ==========================================================================
   4. MASTER ROOMS
   ========================================================================== */

let roomsList = [];

async function loadRoomsData() {
    const res = await API.get('/rooms');
    if (!res.success) return;
    roomsList = res.data || [];

    const tbody = document.querySelector('#roomsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = roomsList.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(r.name)}</strong></td>
            <td>${escapeHtml(r.description || '-')}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openEditRoomModal(${r.room_id})">✏️ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRoom(${r.room_id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function openAddRoomModal() {
    document.getElementById('roomForm').reset();
    document.getElementById('roomId').value = '';
    document.getElementById('roomModalTitle').textContent = 'Tambah Ruangan';
    openModal('roomModal');
}

function openEditRoomModal(id) {
    const r = roomsList.find(x => x.room_id == id);
    if (!r) return;
    document.getElementById('roomModalTitle').textContent = 'Edit Ruangan';
    document.getElementById('roomId').value = r.room_id;
    document.getElementById('roomName').value = r.name;
    document.getElementById('roomDesc').value = r.description || '';
    openModal('roomModal');
}

async function handleRoomSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('roomId').value;
    const payload = {
        name: document.getElementById('roomName').value,
        description: document.getElementById('roomDesc').value
    };
    const res = id ? await API.put(`/rooms/${id}`, payload) : await API.post('/rooms', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('roomModal');
        loadRoomsData();
    } else {
        showToast(res.message, 'error');
    }
}

async function deleteRoom(id) {
    if (confirm('Hapus data ruangan ini?')) {
        const res = await API.delete(`/rooms/${id}`);
        if (res.success) {
            showToast(res.message, 'success');
            loadRoomsData();
        } else {
            showToast(res.message, 'error');
        }
    }
}

/* ==========================================================================
   5. MASTER LOCATIONS, STATUSES, & SUPPLIERS
   ========================================================================== */

let locationsList = [];
async function loadLocationsData() {
    const res = await API.get('/locations');
    if (!res.success) return;
    locationsList = res.data || [];
    const tbody = document.querySelector('#locationsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = locationsList.map((l, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(l.name)}</strong></td>
            <td>${escapeHtml(l.description || '-')}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openEditLocationModal(${l.location_id})">✏️ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteLocation(${l.location_id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function openAddLocationModal() {
    document.getElementById('locationForm').reset();
    document.getElementById('locationId').value = '';
    document.getElementById('locationModalTitle').textContent = 'Tambah Lokasi';
    openModal('locationModal');
}

function openEditLocationModal(id) {
    const l = locationsList.find(x => x.location_id == id);
    if (!l) return;
    document.getElementById('locationModalTitle').textContent = 'Edit Lokasi';
    document.getElementById('locationId').value = l.location_id;
    document.getElementById('locationName').value = l.name;
    document.getElementById('locationDesc').value = l.description || '';
    openModal('locationModal');
}

async function handleLocationSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('locationId').value;
    const payload = {
        name: document.getElementById('locationName').value,
        description: document.getElementById('locationDesc').value
    };
    const res = id ? await API.put(`/locations/${id}`, payload) : await API.post('/locations', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('locationModal');
        loadLocationsData();
    } else {
        showToast(res.message, 'error');
    }
}

async function deleteLocation(id) {
    if (confirm('Hapus lokasi ini?')) {
        const res = await API.delete(`/locations/${id}`);
        if (res.success) {
            showToast(res.message, 'success');
            loadLocationsData();
        } else {
            showToast(res.message, 'error');
        }
    }
}

// Statuses
let statusesList = [];
async function loadStatusesData() {
    const res = await API.get('/statuses');
    if (!res.success) return;
    statusesList = res.data || [];
    const tbody = document.querySelector('#statusesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = statusesList.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td>${escapeHtml(s.description || '-')}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openEditStatusModal(${s.status_id})">✏️ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStatus(${s.status_id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function openAddStatusModal() {
    document.getElementById('statusForm').reset();
    document.getElementById('statusId').value = '';
    document.getElementById('statusModalTitle').textContent = 'Tambah Status';
    openModal('statusModal');
}

function openEditStatusModal(id) {
    const s = statusesList.find(x => x.status_id == id);
    if (!s) return;
    document.getElementById('statusModalTitle').textContent = 'Edit Status';
    document.getElementById('statusId').value = s.status_id;
    document.getElementById('statusName').value = s.name;
    document.getElementById('statusDesc').value = s.description || '';
    openModal('statusModal');
}

async function handleStatusSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('statusId').value;
    const payload = {
        name: document.getElementById('statusName').value,
        description: document.getElementById('statusDesc').value
    };
    const res = id ? await API.put(`/statuses/${id}`, payload) : await API.post('/statuses', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('statusModal');
        loadStatusesData();
    } else {
        showToast(res.message, 'error');
    }
}

async function deleteStatus(id) {
    if (confirm('Hapus status ini?')) {
        const res = await API.delete(`/statuses/${id}`);
        if (res.success) {
            showToast(res.message, 'success');
            loadStatusesData();
        } else {
            showToast(res.message, 'error');
        }
    }
}

// Suppliers
let suppliersList = [];
async function loadSuppliersData() {
    const res = await API.get('/suppliers');
    if (!res.success) return;
    suppliersList = res.data || [];
    const tbody = document.querySelector('#suppliersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = suppliersList.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td>📞 ${escapeHtml(s.phone || '-')}</td>
            <td>✉️ ${escapeHtml(s.email || '-')}</td>
            <td>${escapeHtml(s.address || '-')}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openEditSupplierModal(${s.supplier_id})">✏️ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${s.supplier_id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function openAddSupplierModal() {
    document.getElementById('supplierForm').reset();
    document.getElementById('supplierId').value = '';
    document.getElementById('supplierModalTitle').textContent = 'Tambah Supplier';
    openModal('supplierModal');
}

function openEditSupplierModal(id) {
    const s = suppliersList.find(x => x.supplier_id == id);
    if (!s) return;
    document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
    document.getElementById('supplierId').value = s.supplier_id;
    document.getElementById('supplierName').value = s.name;
    document.getElementById('supplierPhone').value = s.phone || '';
    document.getElementById('supplierEmail').value = s.email || '';
    document.getElementById('supplierAddress').value = s.address || '';
    openModal('supplierModal');
}

async function handleSupplierSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('supplierId').value;
    const payload = {
        name: document.getElementById('supplierName').value,
        phone: document.getElementById('supplierPhone').value,
        email: document.getElementById('supplierEmail').value,
        address: document.getElementById('supplierAddress').value
    };
    const res = id ? await API.put(`/suppliers/${id}`, payload) : await API.post('/suppliers', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('supplierModal');
        loadSuppliersData();
    } else {
        showToast(res.message, 'error');
    }
}

async function deleteSupplier(id) {
    if (confirm('Hapus data supplier ini?')) {
        const res = await API.delete(`/suppliers/${id}`);
        if (res.success) {
            showToast(res.message, 'success');
            loadSuppliersData();
        } else {
            showToast(res.message, 'error');
        }
    }
}

/* ==========================================================================
   6. TRANSAKSI: PEMINJAMAN BARANG (LOANS)
   ========================================================================== */

let loansList = [];

async function loadLoansData() {
    const filterStatus = document.getElementById('filterLoanStatus')?.value || '';
    const res = await API.get(`/loans?status=${encodeURIComponent(filterStatus)}`);
    if (!res.success) return;
    loansList = res.data || [];

    const tbody = document.querySelector('#loansTable tbody');
    if (!tbody) return;

    if (loansList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--text-muted); padding:30px;">Tidak ada catatan peminjaman.</td></tr>';
        return;
    }

    tbody.innerHTML = loansList.map((l, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>
                <strong>${escapeHtml(l.pic_name)}</strong><br>
                <small style="color:var(--text-muted);">${escapeHtml(l.division)}</small>
            </td>
            <td>
                <span class="barcode-badge">${escapeHtml(l.barcode_code)}</span><br>
                ${escapeHtml(l.asset_name)}
            </td>
            <td><strong>${l.quantity}</strong></td>
            <td>${escapeHtml(l.location_destination || '-')}</td>
            <td>${l.loan_date}</td>
            <td>${l.return_date_estimate || '-'}</td>
            <td>${getStatusBadge(l.status)}</td>
            <td>
                ${l.status === 'Dipinjam' ? `
                    <button class="btn btn-success btn-sm" onclick="returnLoanItem(${l.loan_id})">
                        🔄 Kembalikan
                    </button>
                ` : `
                    <span style="font-size:12px; color:var(--text-muted);">Selesai</span>
                `}
            </td>
        </tr>
    `).join('');
}

async function openAddLoanModal() {
    document.getElementById('loanForm').reset();
    document.getElementById('loanDate').value = new Date().toISOString().split('T')[0];

    // Populate Available Assets dropdown
    const res = await API.get('/assets/available-for-loan');
    const select = document.getElementById('loanAsset');
    if (select && res.data) {
        select.innerHTML = '<option value="">-- Pilih Barang yang Tersedia --</option>' +
            res.data.map(a => `
                <option value="${a.asset_id}">
                    [${a.barcode_code}] ${escapeHtml(a.name)} (Stok: ${a.quantity} ${a.unit || 'pcs'})
                </option>
            `).join('');
    }

    openModal('loanModal');
}

async function handleLoanSubmit(e) {
    e.preventDefault();
    const payload = {
        pic_name: document.getElementById('loanPic').value,
        division: document.getElementById('loanDivision').value,
        asset_id: document.getElementById('loanAsset').value,
        quantity: document.getElementById('loanQty').value,
        location_destination: document.getElementById('loanLocation').value,
        loan_date: document.getElementById('loanDate').value,
        return_date_estimate: document.getElementById('loanReturnEstimate').value,
        purpose: document.getElementById('loanPurpose').value
    };

    const res = await API.post('/loans', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('loanModal');
        loadLoansData();
    } else {
        showToast(res.message, 'error');
    }
}

async function returnLoanItem(loanId) {
    if (confirm('Konfirmasi pengembalian barang ini? Stok barang akan otomatis dipulihkan ke sistem.')) {
        const res = await API.put(`/loans/${loanId}/return`);
        if (res.success) {
            showToast(res.message, 'success');
            loadLoansData();
        } else {
            showToast(res.message, 'error');
        }
    }
}

/* ==========================================================================
   7. TRANSAKSI: BARANG KELUAR (OUTBOUND)
   ========================================================================== */

let outboundsList = [];

async function loadOutboundsData() {
    const res = await API.get('/outbounds');
    if (!res.success) return;
    outboundsList = res.data || [];

    const tbody = document.querySelector('#outboundsTable tbody');
    if (!tbody) return;

    if (outboundsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:30px;">Belum ada riwayat pengeluaran barang.</td></tr>';
        return;
    }

    tbody.innerHTML = outboundsList.map((o, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>
                <span class="barcode-badge">${escapeHtml(o.barcode_code)}</span><br>
                <strong>${escapeHtml(o.asset_name)}</strong>
            </td>
            <td><strong>${o.quantity}</strong></td>
            <td>${escapeHtml(o.location_name)}</td>
            <td>${o.outbound_date}</td>
            <td>${escapeHtml(o.purpose || '-')}</td>
        </tr>
    `).join('');
}

async function openAddOutboundModal() {
    document.getElementById('outboundForm').reset();
    document.getElementById('outboundDate').value = new Date().toISOString().split('T')[0];

    const [assetsRes, locsRes] = await Promise.all([
        API.get('/assets'),
        API.get('/locations')
    ]);

    const assetSelect = document.getElementById('outboundAsset');
    if (assetSelect && assetsRes.data) {
        assetSelect.innerHTML = '<option value="">-- Pilih Barang --</option>' +
            assetsRes.data
                .filter(a => a.quantity > 0)
                .map(a => `<option value="${a.asset_id}">[${a.barcode_code}] ${escapeHtml(a.name)} (Stok: ${a.quantity})</option>`).join('');
    }

    const locSelect = document.getElementById('outboundLocation');
    if (locSelect && locsRes.data) {
        locSelect.innerHTML = '<option value="">-- Pilih Lokasi Tujuan --</option>' +
            locsRes.data.map(l => `<option value="${l.location_id}">${escapeHtml(l.name)}</option>`).join('');
    }

    openModal('outboundModal');
}

async function handleOutboundSubmit(e) {
    e.preventDefault();
    const payload = {
        asset_id: document.getElementById('outboundAsset').value,
        location_id: document.getElementById('outboundLocation').value,
        quantity: document.getElementById('outboundQty').value,
        outbound_date: document.getElementById('outboundDate').value,
        purpose: document.getElementById('outboundPurpose').value
    };

    const res = await API.post('/outbounds', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('outboundModal');
        loadOutboundsData();
    } else {
        showToast(res.message, 'error');
    }
}

/* ==========================================================================
   8. TRANSAKSI: BOOKING RUANGAN (MEETING ROOMS)
   ========================================================================== */

let bookingsList = [];

async function loadBookingsData() {
    const statusFilter = document.getElementById('filterBookingStatus')?.value || '';
    const res = await API.get(`/bookings?status=${encodeURIComponent(statusFilter)}`);
    if (!res.success) return;
    bookingsList = res.data || [];

    const tbody = document.querySelector('#bookingsTable tbody');
    if (!tbody) return;

    if (bookingsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:30px;">Tidak ada jadwal booking ruangan.</td></tr>';
        return;
    }

    tbody.innerHTML = bookingsList.map((b, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(b.room_name)}</strong></td>
            <td>
                <div>📅 ${b.start_time.substring(0, 10)}</div>
                <small style="color:var(--text-muted);">⏰ ${b.start_time.substring(11, 16)} s/d ${b.end_time.substring(11, 16)} WIB</small>
            </td>
            <td>
                <strong>${escapeHtml(b.pic_name)}</strong><br>
                <small style="color:var(--text-muted);">${escapeHtml(b.division)} - ${escapeHtml(b.position || '')}</small>
            </td>
            <td>${b.participants} orang</td>
            <td>${escapeHtml(b.purpose || '-')}</td>
            <td>${getStatusBadge(b.status)}</td>
            <td style="white-space:nowrap;">
                ${b.status === 'Pending' ? `
                    <button class="btn btn-success btn-sm" onclick="setBookingStatus(${b.booking_id}, 'Approved')">Setujui</button>
                    <button class="btn btn-danger btn-sm" onclick="setBookingStatus(${b.booking_id}, 'Rejected')">Tolak</button>
                ` : `
                    <span style="font-size:12px; color:var(--text-muted);">-</span>
                `}
            </td>
        </tr>
    `).join('');
}

async function openAddBookingModal() {
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingAvailabilityBanner').style.display = 'none';

    // Populate rooms
    const res = await API.get('/rooms');
    const select = document.getElementById('bookingRoom');
    if (select && res.data) {
        select.innerHTML = '<option value="">-- Pilih Ruangan Rapat --</option>' +
            res.data.map(r => `<option value="${r.room_id}">${escapeHtml(r.name)} (${escapeHtml(r.description || '')})</option>`).join('');
    }

    openModal('bookingModal');
}

async function checkBookingAvailability() {
    const roomId = document.getElementById('bookingRoom').value;
    const start = document.getElementById('bookingStartTime').value;
    const end = document.getElementById('bookingEndTime').value;
    const banner = document.getElementById('bookingAvailabilityBanner');

    if (!roomId || !start || !end) return;

    const res = await API.get(`/bookings/check?room_id=${roomId}&start_time=${encodeURIComponent(start)}&end_time=${encodeURIComponent(end)}`);
    banner.style.display = 'block';

    if (res.available) {
        banner.className = 'db-status-pill online';
        banner.style.width = '100%';
        banner.style.padding = '8px 12px';
        banner.innerHTML = '✅ Ruangan TERSEDIA pada waktu yang dipilih!';
    } else {
        banner.className = 'db-status-pill offline';
        banner.style.width = '100%';
        banner.style.padding = '8px 12px';
        banner.innerHTML = '⚠️ PERINGATAN: Jadwal BENTROK dengan pemesanan lain!';
    }
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    const payload = {
        room_id: document.getElementById('bookingRoom').value,
        start_time: document.getElementById('bookingStartTime').value,
        end_time: document.getElementById('bookingEndTime').value,
        pic_name: document.getElementById('bookingPic').value,
        division: document.getElementById('bookingDivision').value,
        position: document.getElementById('bookingPosition').value,
        participants: document.getElementById('bookingParticipants').value,
        purpose: document.getElementById('bookingPurpose').value,
        status: 'Approved'
    };

    const res = await API.post('/bookings', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('bookingModal');
        loadBookingsData();
    } else {
        showToast(res.message, 'error');
    }
}

async function setBookingStatus(id, newStatus) {
    const res = await API.put(`/bookings/${id}/status`, { status: newStatus });
    if (res.success) {
        showToast(res.message, 'success');
        loadBookingsData();
    } else {
        showToast(res.message, 'error');
    }
}

/* ==========================================================================
   9. STOCK OPNAME MODULE
   ========================================================================== */

let stockOpnameList = [];

async function loadStockOpnameData() {
    const search = document.getElementById('searchStockOpname')?.value || '';
    const res = await API.get(`/stock-opname?search=${encodeURIComponent(search)}`);
    if (!res.success) return;
    stockOpnameList = res.data || [];

    const tbody = document.querySelector('#stockOpnameTable tbody');
    if (!tbody) return;

    tbody.innerHTML = stockOpnameList.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><span class="barcode-badge">${escapeHtml(s.barcode_code)}</span></td>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td><span class="badge ${s.category_type === 'ASET' ? 'badge-info' : 'badge-warning'}">${escapeHtml(s.category_name)}</span></td>
            <td><strong>${s.quantity}</strong> ${escapeHtml(s.unit || 'pcs')}</td>
            <td>${getStatusBadge(s.status)}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openAdjustStockModal(${s.asset_id})">
                    ⚖️ Sesuaikan Stok
                </button>
            </td>
        </tr>
    `).join('');
}

function openAdjustStockModal(assetId) {
    const item = stockOpnameList.find(x => x.asset_id == assetId);
    if (!item) return;

    document.getElementById('opnameAssetId').value = item.asset_id;
    document.getElementById('opnameItemName').textContent = `[${item.barcode_code}] ${item.name}`;
    document.getElementById('opnameSystemQty').textContent = `${item.quantity} ${item.unit || 'pcs'}`;
    document.getElementById('opnamePhysicalQty').value = item.quantity;
    document.getElementById('opnameNotes').value = '';

    openModal('stockOpnameModal');
}

async function handleStockOpnameSubmit(e) {
    e.preventDefault();
    const payload = {
        asset_id: document.getElementById('opnameAssetId').value,
        physical_qty: document.getElementById('opnamePhysicalQty').value,
        notes: document.getElementById('opnameNotes').value
    };

    const res = await API.post('/stock-opname/adjust', payload);
    if (res.success) {
        showToast(res.message, 'success');
        closeModal('stockOpnameModal');
        loadStockOpnameData();
    } else {
        showToast(res.message, 'error');
    }
}

/* ==========================================================================
   10. LAPORAN & CETAK (REPORTING)
   ========================================================================== */

let reportHistoryList = [];

async function loadReportsData() {
    const res = await API.get('/reports/history');
    if (!res.success) return;
    reportHistoryList = res.data || [];

    const tbody = document.querySelector('#reportHistoryTable tbody');
    if (!tbody) return;

    tbody.innerHTML = reportHistoryList.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${r.trans_date}</td>
            <td><span class="barcode-badge">${escapeHtml(r.barcode_code || '-')}</span></td>
            <td><strong>${escapeHtml(r.asset_name)}</strong></td>
            <td><span class="badge ${r.trans_type.includes('Masuk') ? 'badge-success' : (r.trans_type.includes('Keluar') ? 'badge-danger' : 'badge-warning')}">${escapeHtml(r.trans_type)}</span></td>
            <td><strong>${r.quantity}</strong></td>
            <td>${escapeHtml(r.location)}</td>
            <td><small>${escapeHtml(r.purpose)}</small></td>
        </tr>
    `).join('');
}

function triggerExcelExport(type) {
    window.open(`/api/reports/export?type=${type}`, '_blank');
}

function openPrintPreviewModal(reportType) {
    const container = document.getElementById('printPaperContent');
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let title = 'LAPORAN REKAPITULASI ASET DAN MUTASI INVENTARIS';
    let tableHtml = '';

    if (reportType === 'loans') {
        title = 'LAPORAN REKAPITULASI PEMINJAMAN ASET KANTOR';
        tableHtml = `
            <table class="print-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>PIC Peminjam</th>
                        <th>Divisi</th>
                        <th>Barcode & Aset</th>
                        <th>Qty</th>
                        <th>Tgl Pinjam</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${loansList.map((l, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${escapeHtml(l.pic_name)}</td>
                            <td>${escapeHtml(l.division)}</td>
                            <td>[${escapeHtml(l.barcode_code)}] ${escapeHtml(l.asset_name)}</td>
                            <td>${l.quantity}</td>
                            <td>${l.loan_date}</td>
                            <td>${l.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (reportType === 'bookings') {
        title = 'LAPORAN REKAPITULASI PENGGUNAAN RUANG RAPAT';
        tableHtml = `
            <table class="print-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Ruangan</th>
                        <th>Waktu Pelaksanaan</th>
                        <th>PIC & Divisi</th>
                        <th>Peserta</th>
                        <th>Keperluan</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookingsList.map((b, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${escapeHtml(b.room_name)}</td>
                            <td>${b.start_time} s/d ${b.end_time}</td>
                            <td>${escapeHtml(b.pic_name)} (${escapeHtml(b.division)})</td>
                            <td>${b.participants} org</td>
                            <td>${escapeHtml(b.purpose)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        // Default History
        title = 'LAPORAN LOG RIWAYAT SIRKULASI INVENTARIS KANTOR';
        tableHtml = `
            <table class="print-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Barcode</th>
                        <th>Nama Barang</th>
                        <th>Jenis Mutasi</th>
                        <th>Qty</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportHistoryList.map((r, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${r.trans_date}</td>
                            <td>${escapeHtml(r.barcode_code)}</td>
                            <td>${escapeHtml(r.asset_name)}</td>
                            <td>${escapeHtml(r.trans_type)}</td>
                            <td>${r.quantity}</td>
                            <td>${escapeHtml(r.purpose)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    container.innerHTML = `
        <div class="report-header">
            <h2>${title}</h2>
            <p>DIVISI GENERAL AFFAIRS & OPERASIONAL KANTOR</p>
            <p>Sistem Informasi Manajemen Inventaris & Aset</p>
        </div>
        <div class="report-meta">
            <div>Tanggal Cetak: <strong>${today}</strong></div>
            <div>Operator: <strong>${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.role)})</strong></div>
        </div>
        ${tableHtml}
        <div class="print-signatures">
            <div class="signature-block">
                <p>Mengetahui,</p>
                <p><strong>Kepala Divisi GA / IT</strong></p>
                <div class="signature-space"></div>
                <div class="signature-name">( ______________________ )</div>
            </div>
            <div class="signature-block">
                <p>Dicetak Oleh,</p>
                <p><strong>Petugas Inventaris</strong></p>
                <div class="signature-space"></div>
                <div class="signature-name">( ${escapeHtml(currentUser.name)} )</div>
            </div>
        </div>
    `;

    openModal('printModal');
}

function executeBrowserPrint() {
    window.print();
}

/* ==========================================================================
   MODAL DIALOG HELPERS
   ========================================================================== */

function initModals() {
    // Close modal on click outside or on close buttons
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) modal.classList.remove('active');
        });
    });

    // Form submit handlers
    document.getElementById('assetForm')?.addEventListener('submit', handleAssetSubmit);
    document.getElementById('categoryForm')?.addEventListener('submit', handleCategorySubmit);
    document.getElementById('roomForm')?.addEventListener('submit', handleRoomSubmit);
    document.getElementById('locationForm')?.addEventListener('submit', handleLocationSubmit);
    document.getElementById('statusForm')?.addEventListener('submit', handleStatusSubmit);
    document.getElementById('supplierForm')?.addEventListener('submit', handleSupplierSubmit);
    document.getElementById('loanForm')?.addEventListener('submit', handleLoanSubmit);
    document.getElementById('outboundForm')?.addEventListener('submit', handleOutboundSubmit);
    document.getElementById('bookingForm')?.addEventListener('submit', handleBookingSubmit);
    document.getElementById('stockOpnameForm')?.addEventListener('submit', handleStockOpnameSubmit);
    document.getElementById('userForm')?.addEventListener('submit', handleUserSubmit);

    // Live collision check triggers for room booking
    document.getElementById('bookingRoom')?.addEventListener('change', checkBookingAvailability);
    document.getElementById('bookingStartTime')?.addEventListener('change', checkBookingAvailability);
    document.getElementById('bookingEndTime')?.addEventListener('change', checkBookingAvailability);
}

function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('active');
}

function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('active');
}

/* ==========================================================================
   13. USER MANAGEMENT MODULE (SYNOLOGY NAS GROUP RBAC)
   ========================================================================== */

let usersDataList = [];
let availableAccessRoles = [];

async function loadUsersData() {
    const search = document.getElementById('searchUserInput')?.value || '';
    const res = await API.get(`/users?search=${encodeURIComponent(search)}`);
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;

    if (!res.success || !res.data || res.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:24px;">Tidak ada data pengguna ditemukan.</td></tr>';
        return;
    }

    usersDataList = res.data;
    tbody.innerHTML = res.data.map((u, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${escapeHtml(u.username)}</strong></td>
            <td>${escapeHtml(u.name || '-')}</td>
            <td><span class="badge badge-info">${escapeHtml(u.divisi || 'Belum diatur')}</span></td>
            <td><span class="badge ${u.level === 'Administrator' ? 'badge-primary' : 'badge-warning'}">${escapeHtml(u.level || 'Staff')}</span></td>
            <td>
                <span class="badge ${u.is_active ? 'badge-success' : 'badge-danger'}">
                    ${u.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
            </td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openEditUserModal(${u.user_id})" title="Edit User">
                        ✏️ Edit
                    </button>
                    ${u.username === 'admin' ? '' : `
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.user_id}, '${escapeHtml(u.username)}')" title="Hapus User">
                            🗑️ Hapus
                        </button>
                    `}
                </div>
            </td>
        </tr>
    `).join('');
}

async function loadAccessRolesDropdown(selectedId = null) {
    const select = document.getElementById('formUserAccessId');
    if (!select) return;

    try {
        const res = await API.get('/access');
        if (res.success && res.data) {
            availableAccessRoles = res.data;
            select.innerHTML = '<option value="">-- Pilih Divisi & Level Hak Akses --</option>' +
                res.data.map(a => `
                    <option value="${a.access_id}" ${selectedId && selectedId == a.access_id ? 'selected' : ''}>
                        ${escapeHtml(a.divisi)} — (${escapeHtml(a.level)})
                    </option>
                `).join('');
        }
    } catch (e) {
        console.error('Failed to load access roles for dropdown', e);
    }
}

async function openAddUserModal() {
    document.getElementById('userModalTitle').textContent = 'Tambah Pengguna Baru';
    document.getElementById('formUserId').value = '';
    document.getElementById('formUserUsername').value = '';
    document.getElementById('formUserUsername').disabled = false;
    document.getElementById('formUserName').value = '';
    document.getElementById('formUserPassword').value = '';
    document.getElementById('formUserPassword').required = true;
    document.getElementById('pwdRequiredStar').style.display = 'inline';
    document.getElementById('pwdHelpText').style.display = 'none';
    document.getElementById('formUserIsActive').value = '1';

    await loadAccessRolesDropdown();
    openModal('userModal');
}

async function openEditUserModal(userId) {
    const user = usersDataList.find(u => u.user_id == userId);
    if (!user) return;

    document.getElementById('userModalTitle').textContent = `Edit Pengguna: ${user.username}`;
    document.getElementById('formUserId').value = user.user_id;
    document.getElementById('formUserUsername').value = user.username;
    document.getElementById('formUserUsername').disabled = user.username === 'admin';
    document.getElementById('formUserName').value = user.name || '';
    document.getElementById('formUserPassword').value = '';
    document.getElementById('formUserPassword').required = false;
    document.getElementById('pwdRequiredStar').style.display = 'none';
    document.getElementById('pwdHelpText').style.display = 'block';
    document.getElementById('formUserIsActive').value = user.is_active ? '1' : '0';

    await loadAccessRolesDropdown(user.access_id);
    openModal('userModal');
}

async function handleUserSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('formUserId').value;
    const username = document.getElementById('formUserUsername').value.trim();
    const name = document.getElementById('formUserName').value.trim();
    const password = document.getElementById('formUserPassword').value;
    const accessId = document.getElementById('formUserAccessId').value;
    const isActive = parseInt(document.getElementById('formUserIsActive').value);

    if (!username || !name || !accessId) {
        showToast('Mohon lengkapi username, nama, dan pilihan divisi!', 'warning');
        return;
    }

    if (!id && !password) {
        showToast('Password wajib diisi untuk pengguna baru!', 'warning');
        return;
    }

    const payload = {
        username,
        name,
        access_id: accessId,
        is_active: isActive
    };
    if (password) {
        payload.password = password;
    }

    try {
        let res;
        if (id) {
            res = await API.put(`/users/${id}`, payload);
        } else {
            res = await API.post('/users', payload);
        }

        if (res.success) {
            showToast(res.message || 'Data pengguna berhasil disimpan!', 'success');
            closeModal('userModal');
            loadUsersData();

            // If updating current user's profile, update session
            if (id && currentUser && currentUser.userId == id) {
                currentUser.name = name;
                if (res.user) {
                    currentUser.divisi = res.user.divisi;
                    currentUser.level = res.user.level;
                    if (res.user.permissions) {
                        currentUser.permissions = res.user.permissions;
                        applyUserPermissions(currentUser.permissions);
                    }
                }
                localStorage.setItem('inventory_user', JSON.stringify(currentUser));
                checkAuth();
            }
        } else {
            showToast(res.message || 'Gagal menyimpan data pengguna', 'danger');
        }
    } catch (e) {
        showToast('Terjadi kesalahan koneksi server', 'danger');
    }
}

async function deleteUser(userId, username) {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${username}"?`)) return;

    const res = await API.delete(`/users/${userId}`);
    if (res.success) {
        showToast(`Pengguna ${username} berhasil dihapus`, 'success');
        loadUsersData();
    } else {
        showToast(res.message || 'Gagal menghapus pengguna', 'danger');
    }
}

/* ==========================================================================
   14. ACCESS ROLES & PERMISSIONS MODULE (MATCHING USER REFERENCE UI)
   ========================================================================== */

let accessRolesList = [];
let currentAccessPage = 1;
let accessEntriesPerPage = 10;

async function loadAccessData() {
    const searchInput = document.getElementById('searchAccessInput');
    const search = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const entriesSelect = document.getElementById('accessEntriesSelect');
    if (entriesSelect) {
        accessEntriesPerPage = parseInt(entriesSelect.value) || 10;
        entriesSelect.onchange = () => {
            currentAccessPage = 1;
            renderAccessTable();
        };
    }

    const res = await API.get(`/access?search=${encodeURIComponent(search)}`);
    if (!res.success || !res.data) return;

    accessRolesList = res.data;
    renderAccessTable();
}

function renderAccessTable() {
    const searchInput = document.getElementById('searchAccessInput');
    const search = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = accessRolesList.filter(a => 
        (a.divisi && a.divisi.toLowerCase().includes(search)) ||
        (a.level && a.level.toLowerCase().includes(search))
    );

    const total = filtered.length;
    const totalPages = Math.ceil(total / accessEntriesPerPage) || 1;
    if (currentAccessPage > totalPages) currentAccessPage = totalPages;
    if (currentAccessPage < 1) currentAccessPage = 1;

    const startIdx = (currentAccessPage - 1) * accessEntriesPerPage;
    const endIdx = Math.min(startIdx + accessEntriesPerPage, total);
    const pageItems = filtered.slice(startIdx, endIdx);

    const tbody = document.querySelector('#accessTable tbody');
    if (tbody) {
        if (pageItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:28px;">Belum ada data akses ditemukan.</td></tr>';
        } else {
            tbody.innerHTML = pageItems.map((a, idx) => `
                <tr>
                    <td style="text-align: center;">${startIdx + idx + 1}</td>
                    <td style="font-weight: 500;">${escapeHtml(a.divisi)}</td>
                    <td>${escapeHtml(a.level)}</td>
                    <td style="text-align: center;">
                        <div style="display:flex; justify-content:center; gap:6px;">
                            <button class="btn-detail" onclick="openDetailAccess(${a.access_id})" title="Lihat & Atur Hak Akses">
                                Detail
                            </button>
                            <button class="btn-delete" onclick="deleteAccessRole(${a.access_id}, '${escapeHtml(a.divisi)}', '${escapeHtml(a.level)}')" title="Hapus Grup Akses">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Pagination info (e.g., Showing 1 to 10 of 39 entries)
    const infoEl = document.getElementById('accessPaginationInfo');
    if (infoEl) {
        infoEl.textContent = total === 0 ? 'Showing 0 to 0 of 0 entries' : `Showing ${startIdx + 1} to ${endIdx} of ${total} entries`;
    }

    // Pagination links
    const linksEl = document.getElementById('accessPaginationLinks');
    if (linksEl) {
        let pagesHtml = '';
        for (let p = 1; p <= totalPages; p++) {
            pagesHtml += `<button class="page-num ${p === currentAccessPage ? 'active' : ''}" onclick="goToAccessPage(${p})">${p}</button>`;
        }
        linksEl.innerHTML = pagesHtml;
    }
}

function goToAccessPage(page) {
    currentAccessPage = page;
    renderAccessTable();
}

function openAddAccessForm() {
    document.getElementById('accessListScreen').style.display = 'none';
    document.getElementById('accessDetailScreen').style.display = 'block';

    document.getElementById('accessFormTitle').textContent = 'Tambah Akses Baru';
    document.getElementById('accessFormModeBadge').textContent = 'Mode Tambah';
    document.getElementById('formAccessId').value = '';
    document.getElementById('formAccessDivisi').value = '';
    document.getElementById('formAccessLevel').value = 'Staff';

    // Uncheck all checkboxes by default, check dashboard
    toggleAllPerms(false);
    const dashCheck = document.querySelector('.perm-check[value="menu_dashboard"]');
    if (dashCheck) dashCheck.checked = true;
}

async function openDetailAccess(accessId) {
    document.getElementById('accessListScreen').style.display = 'none';
    document.getElementById('accessDetailScreen').style.display = 'block';

    const res = await API.get(`/access/${accessId}`);
    if (!res.success || !res.data) {
        showToast('Gagal memuat detail akses', 'danger');
        return;
    }

    const a = res.data;
    document.getElementById('accessFormTitle').textContent = `Detail Hak Akses: ${a.divisi}`;
    document.getElementById('accessFormModeBadge').textContent = `Level: ${a.level}`;
    document.getElementById('formAccessId').value = a.access_id;
    document.getElementById('formAccessDivisi').value = a.divisi;
    document.getElementById('formAccessLevel').value = a.level;

    // Check permissions
    const perms = Array.isArray(a.permissions) ? a.permissions : [];
    document.querySelectorAll('.perm-check').forEach(cb => {
        cb.checked = perms.includes(cb.value);
    });
}

function closeAccessForm() {
    document.getElementById('accessDetailScreen').style.display = 'none';
    document.getElementById('accessListScreen').style.display = 'block';
    loadAccessData();
}

function toggleAllPerms(checked) {
    document.querySelectorAll('.perm-check').forEach(cb => {
        cb.checked = checked;
    });
}

async function saveAccessPermissions() {
    const id = document.getElementById('formAccessId').value;
    const divisi = document.getElementById('formAccessDivisi').value.trim();
    const level = document.getElementById('formAccessLevel').value.trim();

    if (!divisi || !level) {
        showToast('Divisi dan Level wajib diisi!', 'warning');
        return;
    }

    const checkedPerms = [];
    document.querySelectorAll('.perm-check:checked').forEach(cb => {
        checkedPerms.push(cb.value);
    });

    const payload = {
        divisi,
        level,
        permissions: checkedPerms
    };

    try {
        let res;
        if (id) {
            res = await API.put(`/access/${id}`, payload);
        } else {
            res = await API.post('/access', payload);
        }

        if (res.success) {
            showToast(res.message || 'Hak akses berhasil disimpan!', 'success');
            
            // If current user belongs to this access role, update live permissions!
            if (currentUser && currentUser.divisi === divisi && currentUser.level === level) {
                currentUser.permissions = checkedPerms;
                localStorage.setItem('inventory_user', JSON.stringify(currentUser));
                applyUserPermissions(currentUser.permissions);
            }

            closeAccessForm();
        } else {
            showToast(res.message || 'Gagal menyimpan akses', 'danger');
        }
    } catch (e) {
        showToast('Terjadi kesalahan koneksi server', 'danger');
    }
}

async function deleteAccessRole(id, divisi, level) {
    if (!confirm(`Hapus grup hak akses "${divisi} (${level})"? Pengguna pada divisi ini mungkin akan kehilangan hak akses.`)) {
        return;
    }

    try {
        const res = await API.delete(`/access/${id}`);
        if (res.success) {
            showToast(res.message || 'Grup akses berhasil dihapus', 'success');
            loadAccessData();
        } else {
            showToast(res.message || 'Gagal menghapus akses', 'danger');
        }
    } catch (e) {
        showToast('Terjadi kesalahan koneksi server', 'danger');
    }
}
