const { getPool, isDbConnected } = require('../config/database');

// All available menus in the system
const ALL_MENUS = [
    { key: 'dashboard', label: 'Dashboard Utama', group: 'Ringkasan', desc: 'Melihat ringkasan metrik, grafik, dan jadwal rapat' },
    { key: 'assets', label: 'Data Aset (Barang)', group: 'Master Data', desc: 'Melihat dan mengelola inventaris aset dan barcode' },
    { key: 'categories', label: 'Kategori Barang', group: 'Master Data', desc: 'Klasifikasi kategori aset dan barang habis pakai' },
    { key: 'rooms', label: 'Ruang Rapat', group: 'Master Data', desc: 'Melihat dan mengelola daftar ruang pertemuan' },
    { key: 'locations', label: 'Lokasi Penyimpanan', group: 'Master Data', desc: 'Mengelola lokasi penempatan barang dan gudang' },
    { key: 'statuses', label: 'Status Inventaris', group: 'Master Data', desc: 'Mengelola label status ketersediaan barang' },
    { key: 'suppliers', label: 'Supplier / Vendor', group: 'Master Data', desc: 'Mengelola kontak rekanan penyedia barang' },
    { key: 'loans', label: 'Peminjaman Aset', group: 'Operasional', desc: 'Mencatat peminjaman dan pengembalian aset oleh PIC' },
    { key: 'outbounds', label: 'Barang Keluar (Outbound)', group: 'Operasional', desc: 'Mencatat pengeluaran barang habis pakai (ATK)' },
    { key: 'bookings', label: 'Booking Ruang Rapat', group: 'Operasional', desc: 'Reservasi ruang rapat kantor & cek jadwal bentrok' },
    { key: 'stock-opname', label: 'Stock Opname', group: 'Operasional', desc: 'Melakukan audit fisik stok dan penyesuaian riil' },
    { key: 'reports', label: 'Laporan & Cetak Dokumen', group: 'Pelaporan', desc: 'Melihat rekap histori, ekspor Excel, dan cetak PDF' },
    { key: 'users', label: 'Manajemen Pengguna', group: 'Sistem', desc: 'Menambah, mengubah, dan mengelola user kantor' },
    { key: 'departments', label: 'Departemen & Hak Akses', group: 'Sistem', desc: 'Mengatur matriks izin menu per divisi/departemen' }
];

// Mock data for demo/offline preview
let mockDepartments = [
    { department_id: 1, name: 'IT', description: 'Information Technology - Administrator Sistem & Infrastruktur', user_count: 1, is_deleted: 0 },
    { department_id: 2, name: 'General Affairs', description: 'Pengelolaan Fasilitas, Aset Umum, dan Operasional Gedung', user_count: 1, is_deleted: 0 },
    { department_id: 3, name: 'Keuangan', description: 'Finance & Accounting Perusahaan', user_count: 0, is_deleted: 0 },
    { department_id: 4, name: 'Operasional', description: 'Staff Lapangan dan Operasional Harian', user_count: 1, is_deleted: 0 }
];

let mockDeptPermissions = {
    1: ALL_MENUS.map(m => m.key), // IT: Full Administrator
    2: ['dashboard', 'assets', 'categories', 'rooms', 'locations', 'statuses', 'suppliers', 'loans', 'outbounds', 'bookings', 'stock-opname', 'reports'],
    3: ['dashboard', 'assets', 'reports'],
    4: ['dashboard', 'loans', 'bookings']
};

async function getAllDepartments(req, res) {
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT d.*, COUNT(u.user_id) AS user_count
                FROM departments d
                LEFT JOIN users u ON d.department_id = u.department_id AND u.is_active = 1
                WHERE d.is_deleted = 0
                GROUP BY d.department_id
                ORDER BY d.department_id ASC
            `;
            const [rows] = await pool.query(sql);
            return res.json({ success: true, data: rows, allMenus: ALL_MENUS });
        } else {
            return res.json({ success: true, data: mockDepartments.filter(d => d.is_deleted === 0), allMenus: ALL_MENUS });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function createDepartment(req, res) {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama departemen wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [result] = await pool.query(
                'INSERT INTO departments (name, description, is_deleted) VALUES (?, ?, 0)',
                [name, description || '']
            );

            // Default minimal permissions: dashboard
            await pool.query(
                'INSERT INTO department_permissions (department_id, menu_key, can_view) VALUES (?, "dashboard", 1)',
                [result.insertId]
            );

            return res.json({ success: true, message: 'Departemen berhasil ditambahkan!', id: result.insertId });
        } else {
            const newDept = {
                department_id: Date.now(),
                name,
                description: description || '',
                user_count: 0,
                is_deleted: 0
            };
            mockDepartments.push(newDept);
            mockDeptPermissions[newDept.department_id] = ['dashboard'];
            return res.json({ success: true, message: 'Departemen berhasil ditambahkan (Demo)!', id: newDept.department_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function updateDepartment(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama departemen wajib diisi!' });

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query(
                'UPDATE departments SET name = ?, description = ? WHERE department_id = ?',
                [name, description || '', id]
            );
            return res.json({ success: true, message: 'Data departemen berhasil diperbarui!' });
        } else {
            const d = mockDepartments.find(x => x.department_id == id);
            if (d) {
                d.name = name;
                d.description = description || '';
            }
            return res.json({ success: true, message: 'Data departemen berhasil diperbarui (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function deleteDepartment(req, res) {
    const { id } = req.params;
    if (id == 1) {
        return res.status(400).json({ success: false, message: 'Departemen IT (Administrator Utama) tidak boleh dihapus!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE departments SET is_deleted = 1 WHERE department_id = ?', [id]);
            return res.json({ success: true, message: 'Departemen berhasil dihapus!' });
        } else {
            const d = mockDepartments.find(x => x.department_id == id);
            if (d) d.is_deleted = 1;
            return res.json({ success: true, message: 'Departemen berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function getDepartmentPermissions(req, res) {
    const { id } = req.params;
    try {
        if (isDbConnected()) {
            const pool = getPool();
            // 1. Get Department Info
            const [depts] = await pool.query('SELECT * FROM departments WHERE department_id = ? AND is_deleted = 0', [id]);
            if (depts.length === 0) {
                return res.status(404).json({ success: false, message: 'Departemen tidak ditemukan!' });
            }

            // 2. Get Permissions (allowed menu keys)
            const [perms] = await pool.query('SELECT menu_key FROM department_permissions WHERE department_id = ? AND can_view = 1', [id]);
            const allowedMenus = perms.map(p => p.menu_key);

            // 3. Get all active users, indicating if they belong to this department
            const [users] = await pool.query(`
                SELECT u.user_id, u.username, u.name, u.role, u.department_id, d.name AS department_name
                FROM users u
                LEFT JOIN departments d ON u.department_id = d.department_id
                WHERE u.is_active = 1
                ORDER BY u.name ASC
            `);

            return res.json({
                success: true,
                department: depts[0],
                allowedMenus,
                allMenus: ALL_MENUS,
                users
            });
        } else {
            const d = mockDepartments.find(x => x.department_id == id);
            if (!d) return res.status(404).json({ success: false, message: 'Departemen tidak ditemukan!' });
            return res.json({
                success: true,
                department: d,
                allowedMenus: mockDeptPermissions[id] || ['dashboard'],
                allMenus: ALL_MENUS,
                users: [
                    { user_id: 1, username: 'admin', name: 'Administrator IT', role: 'Administrator', department_id: 1, department_name: 'IT' },
                    { user_id: 2, username: 'staff_ga', name: 'Staff General Affairs', role: 'Staff', department_id: 2, department_name: 'General Affairs' },
                    { user_id: 3, username: 'staff_opr', name: 'Staff Operasional', role: 'Staff', department_id: 4, department_name: 'Operasional' }
                ]
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function saveDepartmentPermissions(req, res) {
    const { id } = req.params;
    const { menu_keys, user_ids } = req.body;

    if (!Array.isArray(menu_keys)) {
        return res.status(400).json({ success: false, message: 'Format menu_keys harus berupa array!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();

                // 1. Clear old permissions for this department
                await conn.query('DELETE FROM department_permissions WHERE department_id = ?', [id]);

                // 2. Insert new permissions
                if (menu_keys.length > 0) {
                    const values = menu_keys.map(key => [id, key, 1]);
                    await conn.query('INSERT INTO department_permissions (department_id, menu_key, can_view) VALUES ?', [values]);
                }

                // 3. Update assigned users if user_ids is provided
                if (Array.isArray(user_ids)) {
                    // First unassign all users currently in this dept who are NOT in user_ids
                    await conn.query('UPDATE users SET department_id = NULL WHERE department_id = ?', [id]);

                    // Then assign all checked user_ids to this department
                    if (user_ids.length > 0) {
                        await conn.query('UPDATE users SET department_id = ? WHERE user_id IN (?)', [id, user_ids]);
                    }
                }

                await conn.commit();
                return res.json({ success: true, message: 'Hak akses menu dan penugasan user departemen berhasil disimpan!' });
            } catch (txErr) {
                await conn.rollback();
                throw txErr;
            } finally {
                conn.release();
            }
        } else {
            mockDeptPermissions[id] = menu_keys;
            return res.json({ success: true, message: 'Hak akses departemen berhasil disimpan (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    ALL_MENUS,
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentPermissions,
    saveDepartmentPermissions,
    _mockDeptPermissions: mockDeptPermissions
};
