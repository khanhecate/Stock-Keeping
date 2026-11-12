const { getPool, isDbConnected } = require('../config/database');

// System Menu & Submenu Definition
const SYSTEM_MENUS = {
    main: [
        { key: 'menu_dashboard', label: 'Dashboard' },
        { key: 'menu_master', label: 'Master Data' },
        { key: 'menu_transaksi', label: 'Operasional & Transaksi' },
        { key: 'menu_laporan', label: 'Laporan & Cetak' },
        { key: 'menu_akses', label: 'Akses & Pengguna' }
    ],
    submenus: [
        {
            group: 'Master Data',
            parentKey: 'menu_master',
            items: [
                { key: 'sub_asset', label: 'Data Aset (Barang)' },
                { key: 'sub_category', label: 'Kategori Barang' },
                { key: 'sub_room', label: 'Ruang Rapat' },
                { key: 'sub_location', label: 'Lokasi Penyimpanan' },
                { key: 'sub_status', label: 'Status Inventaris' },
                { key: 'sub_supplier', label: 'Supplier / Vendor' }
            ]
        },
        {
            group: 'Operasional & Transaksi',
            parentKey: 'menu_transaksi',
            items: [
                { key: 'sub_loan', label: 'Peminjaman Aset' },
                { key: 'sub_outbound', label: 'Barang Keluar (Habis Pakai)' },
                { key: 'sub_booking', label: 'Booking Ruang Rapat' },
                { key: 'sub_stock_opname', label: 'Stock Opname' }
            ]
        },
        {
            group: 'Laporan & Cetak',
            parentKey: 'menu_laporan',
            items: [
                { key: 'sub_report_history', label: 'Log Sirkulasi Aset' },
                { key: 'sub_report_loan', label: 'Laporan Peminjaman' },
                { key: 'sub_report_booking', label: 'Laporan Ruang Rapat' }
            ]
        },
        {
            group: 'Akses & Pengguna',
            parentKey: 'menu_akses',
            items: [
                { key: 'sub_user_list', label: 'List User' },
                { key: 'sub_access_list', label: 'List Akses Divisi' }
            ]
        }
    ]
};

// All keys combined for full admin
const ALL_PERMISSION_KEYS = [
    'menu_dashboard', 'menu_master', 'menu_transaksi', 'menu_laporan', 'menu_akses',
    'sub_asset', 'sub_category', 'sub_room', 'sub_location', 'sub_status', 'sub_supplier',
    'sub_loan', 'sub_outbound', 'sub_booking', 'sub_stock_opname',
    'sub_report_history', 'sub_report_loan', 'sub_report_booking',
    'sub_user_list', 'sub_access_list'
];

// In-Memory store for Mock / Demo mode
let mockAccessRoles = [
    {
        access_id: 1,
        divisi: 'Information Technology',
        level: 'Administrator',
        permissions: ALL_PERMISSION_KEYS,
        is_deleted: 0
    },
    {
        access_id: 2,
        divisi: 'HR & GA',
        level: 'Staff',
        permissions: [
            'menu_dashboard', 'menu_master', 'menu_transaksi', 'menu_laporan',
            'sub_asset', 'sub_category', 'sub_room', 'sub_location', 'sub_status', 'sub_supplier',
            'sub_loan', 'sub_outbound', 'sub_booking', 'sub_stock_opname',
            'sub_report_history', 'sub_report_loan', 'sub_report_booking'
        ],
        is_deleted: 0
    },
    {
        access_id: 3,
        divisi: 'Operasional',
        level: 'Staff',
        permissions: [
            'menu_dashboard', 'menu_transaksi',
            'sub_loan', 'sub_booking'
        ],
        is_deleted: 0
    },
    {
        access_id: 4,
        divisi: 'Accounting, FI & MIS',
        level: 'Staff',
        permissions: [
            'menu_dashboard', 'menu_master', 'menu_laporan',
            'sub_asset', 'sub_category', 'sub_report_history', 'sub_report_loan'
        ],
        is_deleted: 0
    },
    {
        access_id: 5,
        divisi: 'Dewan Komisaris',
        level: 'Staff',
        permissions: [
            'menu_dashboard', 'menu_laporan',
            'sub_report_history', 'sub_report_loan', 'sub_report_booking'
        ],
        is_deleted: 0
    },
    {
        access_id: 6,
        divisi: 'Direktur Utama',
        level: 'Staff',
        permissions: [
            'menu_dashboard', 'menu_transaksi', 'menu_laporan',
            'sub_booking', 'sub_report_history', 'sub_report_loan', 'sub_report_booking'
        ],
        is_deleted: 0
    },
    {
        access_id: 7,
        divisi: 'Audit Intern',
        level: 'Staff',
        permissions: [
            'menu_dashboard', 'menu_transaksi', 'menu_laporan',
            'sub_stock_opname', 'sub_report_history', 'sub_report_loan'
        ],
        is_deleted: 0
    },
    {
        access_id: 8,
        divisi: 'Collection & Remedial',
        level: 'Staff',
        permissions: ['menu_dashboard', 'menu_transaksi', 'sub_booking'],
        is_deleted: 0
    },
    {
        access_id: 9,
        divisi: 'Kepatuhan & Manajemen Risiko',
        level: 'Staff',
        permissions: ['menu_dashboard', 'menu_laporan', 'sub_report_history'],
        is_deleted: 0
    },
    {
        access_id: 10,
        divisi: 'Marketing Funding',
        level: 'Staff',
        permissions: ['menu_dashboard', 'menu_transaksi', 'sub_booking'],
        is_deleted: 0
    }
];

async function getAllAccess(req, res) {
    const search = req.query.search || '';
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const sql = `
                SELECT a.*, COUNT(u.user_id) AS user_count
                FROM access_roles a
                LEFT JOIN users u ON a.access_id = u.access_id AND u.is_active = 1
                WHERE a.is_deleted = 0 AND (a.divisi LIKE ? OR a.level LIKE ?)
                GROUP BY a.access_id
                ORDER BY a.access_id ASC
            `;
            const q = `%${search}%`;
            const [rows] = await pool.query(sql, [q, q]);

            // Parse permissions if stored as JSON
            const formatted = rows.map(r => ({
                ...r,
                permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions) : (r.permissions || [])
            }));

            return res.json({ success: true, data: formatted, systemMenus: SYSTEM_MENUS });
        } else {
            const q = search.toLowerCase();
            const filtered = mockAccessRoles.filter(a =>
                a.is_deleted === 0 &&
                (a.divisi.toLowerCase().includes(q) || a.level.toLowerCase().includes(q))
            );
            return res.json({ success: true, data: filtered, systemMenus: SYSTEM_MENUS });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function getAccessById(req, res) {
    const { id } = req.params;
    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [roles] = await pool.query('SELECT * FROM access_roles WHERE access_id = ? AND is_deleted = 0', [id]);
            if (roles.length === 0) {
                return res.status(404).json({ success: false, message: 'Akses tidak ditemukan!' });
            }

            const role = roles[0];
            role.permissions = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : (role.permissions || []);

            // Also get users assigned to this access profile
            const [users] = await pool.query('SELECT user_id, username, name, is_active FROM users WHERE access_id = ?', [id]);

            return res.json({ success: true, data: role, users, systemMenus: SYSTEM_MENUS });
        } else {
            const role = mockAccessRoles.find(r => r.access_id == id);
            if (!role) return res.status(404).json({ success: false, message: 'Akses tidak ditemukan!' });
            return res.json({
                success: true,
                data: role,
                users: [
                    { user_id: 1, username: 'admin', name: 'Administrator IT', is_active: 1 }
                ],
                systemMenus: SYSTEM_MENUS
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function createAccess(req, res) {
    const { divisi, level, permissions } = req.body;
    if (!divisi || !level) {
        return res.status(400).json({ success: false, message: 'Divisi dan Level wajib diisi!' });
    }

    const perms = Array.isArray(permissions) ? permissions : [];

    try {
        if (isDbConnected()) {
            const pool = getPool();
            const [result] = await pool.query(
                'INSERT INTO access_roles (divisi, level, permissions, is_deleted, created_at) VALUES (?, ?, ?, 0, NOW())',
                [divisi, level, JSON.stringify(perms)]
            );
            return res.json({ success: true, message: 'Akses divisi baru berhasil ditambahkan!', id: result.insertId });
        } else {
            const newAccess = {
                access_id: Date.now(),
                divisi,
                level,
                permissions: perms,
                is_deleted: 0
            };
            mockAccessRoles.push(newAccess);
            return res.json({ success: true, message: 'Akses divisi baru berhasil ditambahkan (Demo)!', id: newAccess.access_id });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function updateAccess(req, res) {
    const { id } = req.params;
    const { divisi, level, permissions } = req.body;

    if (!divisi || !level) {
        return res.status(400).json({ success: false, message: 'Divisi dan Level wajib diisi!' });
    }

    const perms = Array.isArray(permissions) ? permissions : [];

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query(
                'UPDATE access_roles SET divisi = ?, level = ?, permissions = ? WHERE access_id = ?',
                [divisi, level, JSON.stringify(perms), id]
            );

            // Also update any denormalized divisi/level in users table if needed
            await pool.query('UPDATE users SET divisi = ?, level = ? WHERE access_id = ?', [divisi, level, id]);

            return res.json({ success: true, message: 'Pengaturan akses berhasil diperbarui!' });
        } else {
            const role = mockAccessRoles.find(r => r.access_id == id);
            if (role) {
                role.divisi = divisi;
                role.level = level;
                role.permissions = perms;
            }
            return res.json({ success: true, message: 'Pengaturan akses berhasil diperbarui (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function deleteAccess(req, res) {
    const { id } = req.params;
    if (id == 1) {
        return res.status(400).json({ success: false, message: 'Akses Administrator IT tidak boleh dihapus!' });
    }

    try {
        if (isDbConnected()) {
            const pool = getPool();
            await pool.query('UPDATE access_roles SET is_deleted = 1 WHERE access_id = ?', [id]);
            return res.json({ success: true, message: 'Akses berhasil dihapus!' });
        } else {
            const role = mockAccessRoles.find(r => r.access_id == id);
            if (role) role.is_deleted = 1;
            return res.json({ success: true, message: 'Akses berhasil dihapus (Demo)!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    SYSTEM_MENUS,
    ALL_PERMISSION_KEYS,
    getAllAccess,
    getAccessById,
    createAccess,
    updateAccess,
    deleteAccess,
    _mockAccessRoles: mockAccessRoles
};
